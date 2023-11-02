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
  Price,
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
} from '../graphql/types';

const productBundles = ['the-coco-package', 'the-glass-kit', 'the-package'];

// TODO: Add/improve error handling
@Injectable({
  providedIn: 'root',
})
export class ShopifyService {
  constructor(
    private readonly locationService: LocationService,
    private readonly localStorageService: LocalStorageService,
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
      )
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
      )
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
          .pipe(this.mapCart('cartCreate'))
      )
    );
  }

  fetchCart(cartId: string) {
    return this.cartGQL.fetch({ cartId }).pipe(this.mapCart());
  }

  addLineItem(cartId: string, variantId: string) {
    return this.addLineItemGQL
      .mutate({ cartId, variantId })
      .pipe(this.mapCart('cartLinesAdd'));
  }

  removeLineItem(cartId: string, itemId: string) {
    return this.removeLineItemGQL
      .mutate({ cartId, itemId })
      .pipe(this.mapCart('cartLinesRemove'));
  }

  setLineItemQuantity(cartId: string, itemId: string, quantity: number) {
    return this.setLineItemQuantityGQL
      .mutate({ cartId, itemId, quantity })
      .pipe(
        tap((cart) => console.log(cart)),
        this.mapCart('cartLinesUpdate')
      );
  }

  private mapCart(operationName?: string) {
    return (source: Observable<any>): Observable<any> =>
      source.pipe(
        map((response) => {
          const data = (response.data as any) || {};
          const cartParent = operationName ? data[operationName] : data;

          return cartParent?.cart;
        }),
        map((cart: any) => {
          if (!cart) {
            return null;
          }

          const mappedCart = {
            ...cart,
            lines: cart.lines.nodes.map((lineItem: any) => {
              let productTitle: string = lineItem.merchandise.product.title;
              const selectedOptions = lineItem.merchandise.selectedOptions;

              const serie = selectedOptions.find(
                (option: any) => option.name.toLowerCase() === 'series'
              ).value;

              productTitle += ` iPhone ${serie}`;

              const model = selectedOptions.find(
                (option: any) => option.name.toLowerCase() === 'model'
              ).value;

              if (model.toLowerCase() !== 'regular') {
                productTitle += ` ${model}`;
              }

              const color = selectedOptions
                .find((option: any) => option.name.toLowerCase() === 'color')
                ?.value.toLowerCase();

              const productSubtitle = colorTitleMap.get(color);

              return {
                ...lineItem,
                product: {
                  ...lineItem.merchandise,
                  title: productTitle,
                  subtitle: productSubtitle,
                  product: undefined,
                },
                merchandise: undefined,
              };
            }),
          };

          return mappedCart;
        })
      );
  }

  private isBundle(productHandle: string) {
    return productBundles.includes(productHandle);
  }

  fetchFreeShippingThreshold(): Observable<Price | null> {
    const localStorageKey = 'free_shipping_threshold';

    const freeShippingThreshold =
      this.localStorageService.get<Price>(localStorageKey);

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

              return <Price>{
                amount: parseFloat(price.amount),
                currencyCode: price.currencyCode,
              };
            }),
            tap((threshold) =>
              this.localStorageService.set(localStorageKey, threshold)
            ),
            catchError(() => of(null))
          )
      )
    );
  }
}
