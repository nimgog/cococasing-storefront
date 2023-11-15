/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
import {
  FeaturedProduct,
  Money,
  Product,
  ProductVariant,
  discountedProductTagPrefix,
  expectedProductOptions,
  productColors,
  productTiers,
} from '../models/new-product.model';
import { LocationService } from './location.service';
import { LocalStorageService } from './local-storage.service';
import {
  FeaturedProductsGQL,
  FreeShippingProductGQL,
  ProductGQL,
} from '../graphql/types';
import { NotificationService } from './notification.service';
import { catchAndReportError } from '../common/utils/catch-and-report-error.operator';

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
    return this.locationService.getTwoLetterCountryCode().pipe(
      switchMap((countryCode) =>
        this.productGQL.fetch({
          collectionHandle: `new-${productSlug}`,
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

        return response.data.collection.products.nodes;
      }),
      map((shopifyProducts) => {
        const variants = shopifyProducts.flatMap((shopifyProduct) => {
          const { serie, color, tier } = this.parseProductVariantAttributes(
            productSlug,
            shopifyProduct.handle
          );

          const discountPercent = this.getDiscountPercentFromTags(
            shopifyProduct.tags
          );

          const validShopifyProductVariants =
            shopifyProduct.variants.nodes.filter((shopifyProductVariant) => {
              const selectedModels = shopifyProductVariant.selectedOptions
                .filter((option) =>
                  option.name.toLocaleLowerCase().includes('model')
                )
                .map((option) => option.value);

              return selectedModels.every(
                (model) => model === selectedModels[0]
              );
            });

          const productVariants = validShopifyProductVariants.map(
            (shopifyProductVariant) => {
              const modelTitle =
                shopifyProductVariant.selectedOptions.find((option) =>
                  option.name.toLowerCase().includes('model')
                )?.value || '';

              let model = modelTitle
                .replaceAll(' ', '-')
                .toLowerCase()
                .replace(`iphone-${serie}`, '');

              if (model.startsWith('-')) {
                model = model.substring(1);
              }

              const slug = `iphone-${serie}${model ? `-${model}` : ''}${
                color ? `-${color}` : ''
              }${tier ? `-${tier}` : ''}`;

              const productVariant: ProductVariant = {
                id: shopifyProductVariant.id,
                slug,
                serie,
                model: model || 'regular',
                color,
                tier,
                images: shopifyProduct.images.nodes.map((shopifyImage) => ({
                  url: shopifyImage.url,
                  altText: shopifyImage.altText || undefined,
                })),
                price: {
                  amount: parseFloat(shopifyProductVariant.price.amount),
                  currencyCode: shopifyProductVariant.price.currencyCode,
                },
              };

              if (discountPercent) {
                productVariant.originalPrice = {
                  ...productVariant.price,
                };

                productVariant.price = this.applyDiscount(
                  productVariant.price,
                  discountPercent
                );
              }

              return productVariant;
            }
          );

          return productVariants;
        });

        return <Product>{
          slug: productSlug,
          variants,
        };
      }),
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
            const price = shopifyProduct!.priceRange.minVariantPrice;

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

              const discountPercent = this.getDiscountPercentFromTags(
                shopifyFeaturedProduct.tags
              );

              if (discountPercent) {
                featuredProduct.originalPrice = {
                  ...featuredProduct.price,
                };

                featuredProduct.price = this.applyDiscount(
                  featuredProduct.price,
                  discountPercent
                );
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

  parseProductVariantAttributes(productSlug: string, productHandle: string) {
    const expectedOptions = expectedProductOptions.get(productSlug);

    if (!expectedOptions) {
      throw new Error(`Unrecognizable product handle: ${productHandle}`);
    }

    const handleWithoutProductSlug = productHandle.replace(
      `${productSlug}-`,
      ''
    );

    const handleParts = handleWithoutProductSlug.split('-');

    if (handleParts.length < 2 || handleParts[0] !== 'iphone') {
      throw new Error(`Unexpected product handle format: ${productHandle}`);
    }

    let serie = handleParts[1];

    let handleRemainder = handleWithoutProductSlug.replace(
      `iphone-${serie}`,
      ''
    );

    let color: string | undefined = undefined;

    if (expectedOptions.includes('color')) {
      color = productColors.find((productColor) =>
        handleRemainder.includes(productColor)
      )!;
      handleRemainder = handleRemainder.replace(color, '');
    }

    let tier: string | undefined = undefined;

    if (expectedOptions.includes('tier')) {
      tier = productTiers.find((productTier) =>
        handleRemainder.includes(productTier)
      )!;
      handleRemainder = handleRemainder.replace(tier, '');
    }

    serie += handleRemainder.substring(0, handleRemainder.length - 1);

    return { serie, color, tier };
  }

  private getDiscountPercentFromTags(tags: string[]): number | undefined {
    const saleTag = tags.find((tag) =>
      tag.toLocaleLowerCase().includes(discountedProductTagPrefix)
    );

    return saleTag ? parseFloat(saleTag.split('-')[1]) : undefined;
  }

  private applyDiscount(price: Money, discountPercent: number): Money {
    const remainingPercent = 1 - discountPercent / 100;

    return {
      amount: Math.ceil(price.amount * remainingPercent),
      currencyCode: price.currencyCode,
    };
  }
}
