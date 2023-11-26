import { Injectable } from '@angular/core';
import {
  Observable,
  catchError,
  concatMap,
  interval,
  map,
  of,
  share,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { FeaturedProduct, Money, Product } from '../models/product.model';
import { LocationService } from './location.service';
import { LocalStorageService } from './local-storage.service';
import {
  FeaturedProductsGQL,
  FreeShippingProductGQL,
  ProductGQL,
} from '../graphql/types';
import { NotificationService } from './notification.service';
import { catchAndReportError } from '../common/utils/catch-and-report-error.operator';
import {
  applyDiscount,
  getDiscountPercentFromTags,
  mapShopifyProductsToCocoProduct,
} from '../common/utils/shopify-product-helpers';

@Injectable({
  providedIn: 'root',
})
export class ShopifyProductService {
  private static readonly NumberOfFeaturedProducts = 2;
  private static readonly ProductPriceRefreshIntervalInMins = 10;

  private readonly _productPriceRefreshSignal$ = interval(
    ShopifyProductService.ProductPriceRefreshIntervalInMins * 60 * 1000
  ).pipe(
    share(),
    map(() => undefined)
  );

  constructor(
    private readonly locationService: LocationService,
    private readonly localStorageService: LocalStorageService,
    private readonly notificationService: NotificationService,
    private readonly freeShippingProductGQL: FreeShippingProductGQL,
    private readonly productGQL: ProductGQL,
    private readonly featuredProductsGQL: FeaturedProductsGQL
  ) {}

  get productPriceRefreshSignal$() {
    return this._productPriceRefreshSignal$;
  }

  fetchProduct(productSlug: string): Observable<Product> {
    const collectionHandle = `new-${productSlug}`;

    return this.locationService.getTwoLetterCountryCode().pipe(
      switchMap((countryCode) =>
        this.productGQL.fetch({
          collectionHandle,
          countryCode,
        })
      ),
      map((response) => {
        if (
          !response.data?.collection?.products.nodes.length ||
          response.error ||
          response.errors?.length
        ) {
          throw new Error(
            `Shopify request failed: ${JSON.stringify(response)}`
          );
        }

        return response.data.collection;
      }),
      map((shopifyCollection) =>
        mapShopifyProductsToCocoProduct(
          shopifyCollection.products.nodes,
          productSlug,
          shopifyCollection.descriptionHtml
        )
      ),
      catchAndReportError(this.notificationService)
    );
  }

  fetchFreeShippingThreshold(): Observable<Money | null> {
    const localStorageKey = 'free_shipping_threshold';

    const freeShippingThreshold =
      this.localStorageService.get<Money>(localStorageKey);

    if (freeShippingThreshold) {
      return of(freeShippingThreshold);
    }

    return this.locationService.getTwoLetterCountryCode().pipe(
      switchMap((countryCode) =>
        this.freeShippingProductGQL.fetch({ countryCode }).pipe(
          concatMap((response) => {
            if (response.error || response.errors) {
              return of(null).pipe(take(1));
            }

            if (!response.data.product) {
              return of(null).pipe(take(1));
            }

            return of(response.data.product);
          }),
          map((shopifyProduct) => {
            if (!shopifyProduct) {
              throw new Error(
                'Product at this stage should never be null or undefined'
              );
            }

            const price = shopifyProduct.priceRange.minVariantPrice;

            return <Money>{
              amount: parseFloat(price.amount),
              currencyCode: price.currencyCode,
            };
          }),
          tap((threshold) =>
            this.localStorageService.set(localStorageKey, threshold)
          ),
          catchError(() => of(null))
        )
      ),
      catchAndReportError(this.notificationService)
    );
  }

  fetchFeaturedProducts(): Observable<FeaturedProduct[]> {
    return this.locationService.getTwoLetterCountryCode().pipe(
      switchMap((countryCode) =>
        this.featuredProductsGQL.fetch({ countryCode }).pipe(
          map((response) => {
            if (
              !response.data?.collection?.products.nodes.length ||
              response.error ||
              response.errors?.length
            ) {
              throw new Error(
                `Shopify request failed: ${JSON.stringify(response)}`
              );
            }

            return response.data.collection.products.nodes;
          }),
          map((shopifyFeaturedProducts) =>
            shopifyFeaturedProducts.map((shopifyFeaturedProduct) => {
              const handleParts =
                shopifyFeaturedProduct.handle.split('-iphone-');

              const featuredProduct: FeaturedProduct = {
                productSlug: handleParts[0],
                variantSlug: `iphone-${handleParts[1]}`,
                title: shopifyFeaturedProduct.title,
                description: shopifyFeaturedProduct.description,
                image: {
                  url: shopifyFeaturedProduct.featuredImage?.url,
                  altText:
                    shopifyFeaturedProduct.featuredImage?.altText || undefined,
                },
                price: {
                  amount: parseFloat(
                    shopifyFeaturedProduct.priceRange.minVariantPrice.amount
                  ),
                  currencyCode:
                    shopifyFeaturedProduct.priceRange.minVariantPrice
                      .currencyCode,
                },
              };

              const discountPercent = getDiscountPercentFromTags(
                shopifyFeaturedProduct.tags
              );

              if (discountPercent) {
                featuredProduct.originalPrice = {
                  ...featuredProduct.price,
                };

                featuredProduct.price = applyDiscount(
                  featuredProduct.price,
                  discountPercent
                );

                featuredProduct.discountPercent = discountPercent;
              }

              return featuredProduct;
            })
          ),
          map((featuredProducts) =>
            featuredProducts.slice(
              0,
              ShopifyProductService.NumberOfFeaturedProducts
            )
          ),
          catchAndReportError(this.notificationService)
        )
      )
    );
  }
}
