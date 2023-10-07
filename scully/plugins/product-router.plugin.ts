/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import { firstValueFrom, from, map } from 'rxjs';
import { HandledRoute, registerPlugin } from '@scullyio/scully';
import { environment } from '../../src/environments/environment';

export const productRouterPlugin = 'productRouterPlugin';

// TODO: Extract
const fullColorNameLookup = new Map<string, string>([
  ['beige', 'desert-beige'],
  ['black', 'jet-black'],
  ['blue', 'midnight-blue'],
  ['green', 'forest-green'],
  ['lavender', 'french-lavender'],
  ['orange', 'sunset-orange'],
]);

let cachedRoutes: {
  productRoutes: string[];
  variationRoutes: string[];
} | null = null;

const productRouter = async (
  routeTemplate: string
): Promise<HandledRoute[]> => {
  if (!cachedRoutes) {
    const apolloClient = new ApolloClient<any>({
      uri: environment.storeFrontEndpoint,
      headers: {
        'X-Shopify-Storefront-Access-Token': environment.storeFrontAT,
      },
      cache: new InMemoryCache(),
    });

    cachedRoutes = await firstValueFrom(fetchAllProductRoutes(apolloClient));
  }

  const routes = routeTemplate.includes(':variation')
    ? cachedRoutes.variationRoutes
    : cachedRoutes.productRoutes;

  return routes.map((route) => ({
    route,
  }));
};

registerPlugin('router', productRouterPlugin, productRouter);

const fetchAllProductRoutes = (apolloClient: ApolloClient<any>) => {
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

  return from(apolloClient.query<any>({ query })).pipe(
    map((result) => result.data.collection.products.nodes),
    map((products: any[]) => {
      const productRoutes = [];
      const variationRoutes = [];

      products.forEach((product) => {
        productRoutes.push(`/products/${product.handle}`);

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

        const variationRoutesForProduct = product.variants.nodes.map(
          (variant: any) => {
            const variantOptionValues = variant.title
              .split('/')
              .map((attribute: string) =>
                attribute.trim().toLowerCase().replace(' ', '-')
              ) as string[];

            const serie = variantOptionValues.find((optionValue) =>
              (optionsMap.get('series') || []).includes(optionValue)
            );

            const model = variantOptionValues.find((optionValue) =>
              (optionsMap.get('model') || []).includes(optionValue)
            );

            let variantSlug = `iphone-${serie}-${model}`;

            const color = variantOptionValues.find((optionValue) =>
              (optionsMap.get('color') || []).includes(optionValue)
            );

            if (color) {
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
          }
        ) as string[];

        variationRoutes.push(...variationRoutesForProduct);
      });

      return { productRoutes, variationRoutes };
    })
  );
};
