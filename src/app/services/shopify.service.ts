/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { colorTitleMap } from '../models/new-product.model';
import { LocationService } from './location.service';

@Injectable({
  providedIn: 'root',
})
export class ShopifyService {
  constructor(
    private readonly shopifyGraphQL: Apollo,
    private readonly locationService: LocationService
  ) {}

  fetchProduct(productHandle: string) {
    const query = gql`
      query fetchProduct($handle: String!, $countryCode: CountryCode!)
      @inContext(country: $countryCode) {
        product(handle: $handle) {
          title
          description
          options {
            name
            values
          }
          media(first: 250) {
            nodes {
              mediaContentType
              previewImage {
                url
                altText
              }
            }
          }
          variants(first: 250) {
            nodes {
              id
              selectedOptions {
                name
                value
              }
              price {
                amount
                currencyCode
              }
              image {
                url
                altText
              }
            }
          }
        }
      }
    `;

    return this.locationService.getTwoLetterCountryCode().pipe(
      switchMap((countryCode) =>
        this.shopifyGraphQL
          .query<any>({
            query,
            variables: { handle: productHandle, countryCode },
          })
          .pipe(
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
                      // TODO: Extract this
                      const fullColorNameLookup = new Map<string, string>([
                        ['beige', 'desert-beige'],
                        ['black', 'jet-black'],
                        ['blue', 'midnight-blue'],
                        ['green', 'forest-green'],
                        ['lavender', 'french-lavender'],
                        ['orange', 'sunset-orange'],
                      ]);

                      variantHandle += `-${fullColorNameLookup.get(color)}`;
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

  // TODO: Consider adding pagination later (altough 250 line items should be more than enough)
  private readonly fetchCartFragment = `
    id
    checkoutUrl
    lines(first: 250) {
      nodes {
        id
        merchandise {
          ... on ProductVariant {
            id
            image {
              url(transform: {maxWidth: 120, maxHeight: 120})
            }
            product {
              title
            }
            selectedOptions {
              name
              value
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        quantity
      }
    }
    cost {
      totalAmount {
        amount
        currencyCode
      }
    }
    totalQuantity
  `;

  createCart(variantId: string) {
    const mutation = gql`
      mutation createCart($variantId: ID!, $countryCode: CountryCode!)
      @inContext(country: $countryCode) {
        cartCreate(
          input: { lines: { merchandiseId: $variantId, quantity: 1 } }
        ) {
          cart {
            ${this.fetchCartFragment}
          }
        }
      }
    `;

    return this.locationService.getTwoLetterCountryCode().pipe(
      switchMap((countryCode) =>
        this.shopifyGraphQL
          .mutate({
            mutation,
            variables: {
              variantId,
              countryCode,
            },
          })
          .pipe(this.mapCart('cartCreate'))
      )
    );
  }

  fetchCart(cartId: string) {
    const query = gql`
      query fetchCart($cartId: ID!) {
        cart(id: $cartId) {
          ${this.fetchCartFragment}
        }
      }
    `;

    return this.shopifyGraphQL
      .query({ query, variables: { cartId } })
      .pipe(this.mapCart());
  }

  addLineItem(cartId: string, variantId: string) {
    const mutation = gql`
      mutation addLineItem($cartId: ID!, $variantId: ID!) {
        cartLinesAdd(cartId: $cartId, lines: {merchandiseId: $variantId}) {
          cart {
            ${this.fetchCartFragment}
          }
        }
      }
    `;

    return this.shopifyGraphQL
      .mutate({
        mutation,
        variables: { cartId, variantId },
      })
      .pipe(this.mapCart('cartLinesAdd'));
  }

  removeLineItem(cartId: string, itemId: string) {
    const mutation = gql`
      mutation removeLineItem($cartId: ID!, $itemId: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $itemId) {
          cart {
            ${this.fetchCartFragment}
          }
        }
      }
    `;

    return this.shopifyGraphQL
      .mutate({
        mutation,
        variables: { cartId, itemId },
      })
      .pipe(this.mapCart('cartLinesRemove'));
  }

  setLineItemQuantity(cartId: string, itemId: string, quantity: number) {
    const mutation = gql`
      mutation setLineItemQuantity($cartId: ID!, $itemId: ID!, $quantity: Int!) {
        cartLinesUpdate(cartId: $cartId, lines: {id: $itemId, quantity: $quantity}) {
          cart {
            ${this.fetchCartFragment}
          }
        }
      }
    `;

    return this.shopifyGraphQL
      .mutate({
        mutation,
        variables: { cartId, itemId, quantity },
      })
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
}
