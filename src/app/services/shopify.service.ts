/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, mergeMap, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShopifyService {
  constructor(private readonly shopifyGraphQL: Apollo) {}

  fetchProduct(productHandle: string, countryCode: string) {
    const query = gql`
      query fetchProduct($handle: String!) @inContext(country: ${countryCode}) {
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

    return this.shopifyGraphQL
      .query<any>({
        query,
        variables: { handle: productHandle },
      })
      .pipe(
        tap((response) => console.log(response)),
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
                  .find((option: any) => option.name.toLowerCase() === 'series')
                  ?.value.toLowerCase();

                let variantHandle = `iphone-${serie}`;

                const model = theVariant.selectedOptions
                  .find((option: any) => option.name.toLowerCase() === 'model')
                  ?.value.toLowerCase()
                  .replace(' ', '-');

                if (model !== 'regular') {
                  variantHandle += `-${model}`;
                }

                const color = theVariant.selectedOptions
                  .find((option: any) => option.name.toLowerCase() === 'color')
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
            }),
            tap((x) => console.log(x))
          );
        })
      );
  }
}
