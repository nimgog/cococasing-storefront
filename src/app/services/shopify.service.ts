/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Injectable } from '@angular/core';
import {
  Observable,
  catchError,
  map,
  mergeMap,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {
  Money,
  colorSlugMap,
  colorTitleMap,
} from '../models/new-product.model';
import { LocationService } from './location.service';
import { LocalStorageService } from './local-storage.service';
import {
  AddLineItemGQL,
  CartGQL,
  CreateCartGQL,
  FreeShippingProductGQL,
  ProductGQL,
  RemoveLineItemGQL,
  SetLineItemQuantityGQL,
  ShoppingCartFragment,
} from '../graphql/types';
import { LineItem, ShoppingCart } from '../models/shopping-cart.model';
import { NotificationService } from './notification.service';
import { catchAndReportError } from '../utils/catch-and-report-error.operator';

const productBundles = ['the-coco-package', 'the-glass-kit', 'the-package'];

// TODO: Add/improve error handling
@Injectable({
  providedIn: 'root',
})
export class ShopifyService {
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
    private readonly productGQL: ProductGQL
  ) {}

  fetchProductBundle(productHandle: string) {
    return this.locationService.getTwoLetterCountryCode().pipe(
      switchMap((countryCode) =>
        this.productGQL.fetch({ handle: productHandle, countryCode }).pipe(
          mergeMap((response) => {
            if (
              !response.data?.product ||
              response.error ||
              response.errors?.length
            ) {
              return of(null);
            }

            return of(response.data.product).pipe(
              map((product) => {
                const media = product.media.nodes.map(
                  (mediaNode: any) => mediaNode.previewImage
                );

                const optionMap = new Map<string, string[]>(
                  product.options.map((option: any) => [
                    option.name.toLowerCase(),
                    option.values.map((value: string) =>
                      value.toLowerCase().replace(' ', '-')
                    ),
                  ])
                );

                const getVariantInfo = (theVariant: any) => {
                  const serie = theVariant.selectedOptions
                    .find(
                      (option: any) => option.name.toLowerCase() === 'series'
                    )
                    ?.value.toLowerCase();

                  let variantHandle = `iphone-${serie}`;

                  const model = theVariant.selectedOptions
                    .find(
                      (option: any) => option.name.toLowerCase() === 'model'
                    )
                    ?.value.toLowerCase()
                    .replace(' ', '-');

                  if (model !== 'regular') {
                    variantHandle += `-${model}`;
                  }

                  const color = theVariant.selectedOptions
                    .find(
                      (option: any) => option.name.toLowerCase() === 'color'
                    )
                    ?.value.toLowerCase();

                  if (color) {
                    variantHandle += `-${colorSlugMap.get(color)}`;
                  }

                  return {
                    handle: variantHandle,
                    serie,
                    model,
                    color,
                  };
                };

                const variantMap = new Map<string, any>(
                  product.variants.nodes.map((variant: any) => {
                    const { handle, serie, model, color } =
                      getVariantInfo(variant);

                    return [
                      handle,
                      {
                        id: variant.id,
                        serie,
                        model,
                        color,
                        price: variant.price,
                        image: variant.image,
                      },
                    ];
                  })
                );

                return {
                  title: product.title,
                  description: product.description,
                  media,
                  optionMap,
                  variantMap,
                };
              })
            );
          })
        )
      ),
      catchAndReportError(this.notificationService)
    );
  }

  fetchProduct(productHandle: string) {
    if (this.isBundle(productHandle)) {
      return this.fetchProductBundle(productHandle);
    }

    return this.locationService.getTwoLetterCountryCode().pipe(
      switchMap((countryCode) =>
        this.productGQL.fetch({ handle: productHandle, countryCode }).pipe(
          mergeMap((response) => {
            if (
              !response.data?.product ||
              response.error ||
              response.errors?.length
            ) {
              return of(null);
            }

            return of(response.data.product).pipe(
              map((product) => {
                const media = product.media.nodes.map(
                  (mediaNode: any) => mediaNode.previewImage
                );

                const optionMap = new Map<string, string[]>(
                  product.options.map((option: any) => [
                    option.name.toLowerCase(),
                    option.values.map((value: string) =>
                      value.toLowerCase().replace(' ', '-')
                    ),
                  ])
                );

                const getVariantInfo = (theVariant: any) => {
                  const serie = theVariant.selectedOptions
                    .find(
                      (option: any) => option.name.toLowerCase() === 'series'
                    )
                    ?.value.toLowerCase();

                  let variantHandle = `iphone-${serie}`;

                  const model = theVariant.selectedOptions
                    .find(
                      (option: any) => option.name.toLowerCase() === 'model'
                    )
                    ?.value.toLowerCase()
                    .replace(' ', '-');

                  if (model !== 'regular') {
                    variantHandle += `-${model}`;
                  }

                  const color = theVariant.selectedOptions
                    .find(
                      (option: any) => option.name.toLowerCase() === 'color'
                    )
                    ?.value.toLowerCase();

                  if (color) {
                    variantHandle += `-${colorSlugMap.get(color)}`;
                  }

                  return {
                    handle: variantHandle,
                    serie,
                    model,
                    color,
                  };
                };

                const variantMap = new Map<string, any>(
                  product.variants.nodes.map((variant: any) => {
                    const { handle, serie, model, color } =
                      getVariantInfo(variant);

                    return [
                      handle,
                      {
                        id: variant.id,
                        serie,
                        model,
                        color,
                        price: variant.price,
                        image: variant.image,
                      },
                    ];
                  })
                );

                return {
                  title: product.title,
                  description: product.description,
                  media,
                  optionMap,
                  variantMap,
                };
              })
            );
          })
        )
      ),
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

  private mapCart(
    cartFragment: ShoppingCartFragment | null | undefined
  ): ShoppingCart {
    if (!cartFragment) {
      throw new Error('Failed to map cart as it was unavailable');
    }

    // TODO: Revisit this for correct title-subtitle mapping once other products are being handled, too
    const lines: LineItem[] = cartFragment.lines.nodes.map((lineItem) => {
      const { merchandise } = lineItem;
      const selectedOptions = merchandise.selectedOptions;
      let productTitle = merchandise.product.title;

      const serie = selectedOptions.find(
        (option) => option.name.toLowerCase() === 'series'
      )?.value;

      productTitle += ` iPhone ${serie}`;

      const model = selectedOptions.find(
        (option) => option.name.toLowerCase() === 'model'
      )?.value;

      if (model && model.toLowerCase() !== 'regular') {
        productTitle += ` ${model}`;
      }

      const color = selectedOptions
        .find((option) => option.name.toLowerCase() === 'color')
        ?.value.toLowerCase();

      const productSubtitle = color ? colorTitleMap.get(color) : '';

      return <LineItem>{
        id: lineItem.id,
        product: {
          id: merchandise.id,
          title: productTitle,
          subtitle: productSubtitle,
          imageUrl: merchandise.image?.url,
        },
        totalCost: {
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
      totalCost: {
        amount: parseFloat(cartFragment.cost.totalAmount.amount),
        currencyCode: cartFragment.cost.totalAmount.currencyCode,
      },
      totalQuantity: cartFragment.totalQuantity,
    };

    return cart;
  }

  private isBundle(productHandle: string) {
    return productBundles.includes(productHandle);
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
        this.freeShippingProductGQL
          .fetch({
            handle: 'dummy-product-free-shipping-at-20',
            countryCode,
          })
          .pipe(
            switchMap((response) => {
              if (response.error || response.errors) {
                return of(null).pipe(take(1));
              }

              if (!response.data.product) {
                return of(null).pipe(take(1));
              }

              return of(response.data.product);
            }),
            map((product) => {
              const price = product!.priceRange.minVariantPrice;

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
}
