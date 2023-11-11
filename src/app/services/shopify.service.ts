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
  AddLineItemGQL,
  CartGQL,
  CreateCartGQL,
  FeaturedProductsGQL,
  FreeShippingProductGQL,
  ProductGQL,
  RemoveLineItemGQL,
  SetLineItemQuantityGQL,
  ShoppingCartFragment,
} from '../graphql/types';
import { LineItem, ShoppingCart } from '../models/shopping-cart.model';
import { NotificationService } from './notification.service';
import { catchAndReportError } from '../common/utils/catch-and-report-error.operator';

@Injectable({
  providedIn: 'root',
})
export class ShopifyService {
  private static readonly ProductPriceRefreshIntervalInMins = 10;

  private readonly _productPriceRefreshSignal$ = interval(
    ShopifyService.ProductPriceRefreshIntervalInMins * 60 * 1000
  ).pipe(
    share(),
    map(() => undefined)
  );

  constructor(
    private readonly locationService: LocationService,
    private readonly localStorageService: LocalStorageService,
    private readonly notificationService: NotificationService,
    private readonly freeShippingProductGQL: FreeShippingProductGQL,
    private readonly addLineItemGQL: AddLineItemGQL,
    private readonly removeLineItemGQL: RemoveLineItemGQL,
    private readonly cartGQL: CartGQL,
    private readonly createCartGQL: CreateCartGQL,
    private readonly setLineItemQuantityGQL: SetLineItemQuantityGQL,
    private readonly productGQL: ProductGQL,
    private readonly featuredProductsGQL: FeaturedProductsGQL
  ) {}

  get productPriceRefreshSignal$() {
    return this._productPriceRefreshSignal$;
  }

  fetchProduct(productSlug: string) {
    // const expectedOptions = expectedProductOptions.get(productSlug)!;

    // TODO: Determine observable type
    // if (!expectedOptions) {
    //   return catchAndReportError(this.notificationService)
    // }

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

              return <ProductVariant>{
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
                  amount: shopifyProductVariant.price.amount,
                  currencyCode: shopifyProductVariant.price.currencyCode,
                },
              };
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

  createCart(variantId: string) {
    return this.locationService.getTwoLetterCountryCode().pipe(
      switchMap((countryCode) =>
        this.createCartGQL
          .mutate({
            variantId,
            countryCode,
          })
          .pipe(
            map((response) => this.mapCart(response.data?.cartCreate?.cart))
          )
      ),
      catchAndReportError(this.notificationService)
    );
  }

  fetchCart(cartId: string) {
    return this.cartGQL.fetch({ cartId }).pipe(
      map((response) => response.data?.cart),
      map((cart) => (cart ? this.mapCart(cart) : null)),
      catchAndReportError(this.notificationService)
    );
  }

  addLineItem(cartId: string, variantId: string) {
    return this.addLineItemGQL.mutate({ cartId, variantId }).pipe(
      map((response) => this.mapCart(response.data?.cartLinesAdd?.cart)),
      catchAndReportError(this.notificationService)
    );
  }

  setLineItemQuantity(cartId: string, itemId: string, quantity: number) {
    return this.setLineItemQuantityGQL
      .mutate({ cartId, itemId, quantity })
      .pipe(
        map((response) => this.mapCart(response.data?.cartLinesUpdate?.cart)),
        catchAndReportError(this.notificationService)
      );
  }

  removeLineItem(cartId: string, itemId: string) {
    return this.removeLineItemGQL.mutate({ cartId, itemId }).pipe(
      map((response) => this.mapCart(response.data?.cartLinesRemove?.cart)),
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

              const saleTag = shopifyFeaturedProduct.tags.find((tag) =>
                tag.toLocaleLowerCase().includes(discountedProductTagPrefix)
              );

              if (saleTag) {
                featuredProduct.originalPrice = {
                  ...featuredProduct.price,
                };

                featuredProduct.discountPercent = parseFloat(
                  saleTag.split('-')[1]
                );

                const remainingPercent =
                  1 - featuredProduct.discountPercent / 100;

                featuredProduct.price.amount = Math.ceil(
                  featuredProduct.price.amount * remainingPercent
                );
              }

              return featuredProduct;
            })
          ),
          catchAndReportError(this.notificationService)
        )
      )
    );
  }

  private mapCart(
    cartFragment: ShoppingCartFragment | null | undefined
  ): ShoppingCart {
    if (!cartFragment) {
      throw new Error('Failed to map cart as it was unavailable');
    }

    const lines: LineItem[] = cartFragment.lines.nodes.map((lineItem) => {
      const {
        merchandise: {
          id: productId,
          product,
          selectedOptions,
          image: productImage,
        },
      } = lineItem;

      const allProductSlugs = [...expectedProductOptions.keys()];
      const productSlug = allProductSlugs.find((slug) =>
        product.handle.includes(slug)
      );

      if (!productSlug) {
        throw new Error('Unrecognizable product handle: ' + product.handle);
      }

      const { serie, color, tier } = this.parseProductVariantAttributes(
        productSlug,
        product.handle
      );

      let model = selectedOptions
        .find((option) => option.name.toLowerCase().includes('model'))
        ?.value.replaceAll(' ', '-')
        .toLocaleLowerCase()
        .replace(`iphone-${serie}`, '');

      if (model?.startsWith('-')) {
        model = model.substring(1);
      }

      const subtitleParts = [];

      if (color) {
        subtitleParts.push(color);
      }

      if (tier) {
        subtitleParts.push(tier);
      }

      return <LineItem>{
        id: lineItem.id,
        product: {
          id: productId,
          title: `${productSlug}-iphone-${serie}${model ? `-${model}` : ''}`,
          subtitle: subtitleParts.join('-'),
          imageUrl: productImage?.url,
        },
        originalTotalPrice: {
          amount: parseFloat(lineItem.cost.subtotalAmount.amount),
          currencyCode: lineItem.cost.subtotalAmount.currencyCode,
        },
        discountedTotalPrice: {
          amount: parseFloat(lineItem.cost.totalAmount.amount),
          currencyCode: lineItem.cost.totalAmount.currencyCode,
        },
        quantity: lineItem.quantity,
      };
    });

    const cart: ShoppingCart = {
      id: cartFragment.id,
      checkoutUrl: cartFragment.checkoutUrl,
      lines,
      originalTotalPrice: {
        amount: lines
          .map((lineItem) => lineItem.originalTotalPrice)
          .reduce((sum, currentPrice) => sum + currentPrice.amount, 0),
        currencyCode: cartFragment.cost.totalAmount.currencyCode,
      },
      discountedTotalPrice: {
        amount: parseFloat(cartFragment.cost.totalAmount.amount),
        currencyCode: cartFragment.cost.totalAmount.currencyCode,
      },
      totalQuantity: cartFragment.totalQuantity,
    };

    return cart;
  }

  private parseProductVariantAttributes(
    productSlug: string,
    productHandle: string
  ) {
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
}
