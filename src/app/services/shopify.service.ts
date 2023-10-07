/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShopifyService {
  constructor(private readonly shopifyGraphQL: Apollo) {}

  fetchAllProductRoutes() {
    const query = gql`
      {
        collection(handle: "new-products") {
          products(first: 250) {
            nodes {
              handle
              options {
                name
                values
              }
              variants(first: 250) {
                nodes {
                  id
                  title
                }
              }
            }
          }
        }
      }
    `;

    return this.shopifyGraphQL.query<any>({ query }).pipe(
      map((result) => result.data.collection.products.nodes),
      map((products: any[]) =>
        products.flatMap((product) => {
          const optionsMap = product.options.reduce(
            (
              prevMap: Map<string, string[]>,
              option: { name: string; values: string[] }
            ) => {
              const key = option.name.toLowerCase();
              const values = option.values.map((value: string) =>
                value.toLowerCase().replace(' ', '-')
              );

              prevMap.set(key, values);

              return prevMap;
            },
            new Map<string, string[]>()
          ) as Map<string, string[]>;

          const variantRoutes = product.variants.nodes.map((variant: any) => {
            const variantOptionValues = variant.title
              .split('/')
              .map((attribute: string) =>
                attribute.trim().toLowerCase().replace(' ', '-')
              ) as string[];

            let variantSlug = '';

            const serie = variantOptionValues.find((optionValue) =>
              (optionsMap.get('series') || []).includes(optionValue)
            );

            variantSlug += `iphone-${serie}`;

            const model = variantOptionValues.find((optionValue) =>
              (optionsMap.get('model') || []).includes(optionValue)
            );

            variantSlug += `-${model}`;

            const color = variantOptionValues.find((optionValue) =>
              (optionsMap.get('color') || []).includes(optionValue)
            );

            if (color) {
              const fullColorNameLookup = new Map<string, string>([
                ['beige', 'desert-beige'],
                ['black', 'jet-black'],
                ['blue', 'midnight-blue'],
                ['green', 'forest-green'],
                ['lavender', 'french-lavender'],
                ['orange', 'sunset-orange'],
              ]);

              const fullColorName = fullColorNameLookup.get(color) || color;
              variantSlug += `-${fullColorName}`;
            }

            if (variantSlug.includes('undefined')) {
              console.error(
                'Could not compose the variant slug from options:',
                variantOptionValues
              );
            }

            return `/products/${product.handle}/${variantSlug}`;
          }) as string[];

          variantRoutes.push(`/products/${product.handle}`);

          return variantRoutes;
        })
      ),
      tap((result) => {
        console.log(result);
      })
    );
  }
}
