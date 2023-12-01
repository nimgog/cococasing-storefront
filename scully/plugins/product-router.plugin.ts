/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ApolloClient,
  ApolloQueryResult,
  InMemoryCache,
  NormalizedCacheObject,
  gql,
} from '@apollo/client/core';
import { firstValueFrom, from, map, mergeMap, toArray } from 'rxjs';
import { HandledRoute, registerPlugin } from '@scullyio/scully';
import { environment } from '../../src/environments/environment.prod';
import {
  Money,
  Product,
  ProductVariant,
  defaultProductModel,
  discountedProductTagPrefix,
  expectedProductOptions,
  productColors,
  productTiers,
} from '../../src/app/models/product.model';

export const productRouterPlugin = 'productRouterPlugin';

const productRouter = async (
  routeTemplate: string
): Promise<HandledRoute[]> => {
  const allProductSlugs = [...expectedProductOptions.keys()];

  if (!routeTemplate.includes(':variant')) {
    return allProductSlugs.map((productSlug) => ({
      route: `/products/${productSlug}`,
    }));
  }

  const apolloClient = new ApolloClient({
    uri: environment.storeFrontEndpoint,
    headers: {
      'X-Shopify-Storefront-Access-Token': environment.storeFrontAT,
    },
    cache: new InMemoryCache(),
  });

  const productRoutes$ = from(allProductSlugs).pipe(
    mergeMap((productSlug) => fetchProduct(apolloClient, productSlug)),
    toArray(),
    map((products) =>
      products.flatMap((product) =>
        product.variants.map(
          (variant) => `/products/${product.slug}/${variant.slug}`
        )
      )
    )
  );

  const routes = await firstValueFrom(productRoutes$);

  return routes.map((route) => ({ route }));
};

registerPlugin('router', productRouterPlugin, productRouter);

/*
    GRAPHQL QUERY BELOW WAS COPIED FROM 'src/app/graphql/queries/product.gql'
*/

const fetchProduct = (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  productSlug: string
) => {
  const query = gql`
    query Product($collectionHandle: String!, $countryCode: CountryCode!)
    @inContext(country: $countryCode) {
      collection(handle: $collectionHandle) {
        products(first: 250) {
          nodes {
            handle
            images(first: 250) {
              nodes {
                url
                altText
              }
            }
            options {
              name
              values
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
              }
            }
            tags
          }
        }
      }
    }
  `;

  const collectionHandle = `new-${productSlug}`;
  const countryCode = 'SE'; // This is just a dummy value to satisfy the reused GraphQL query

  return from(
    apolloClient.query({
      query,
      variables: {
        collectionHandle,
        countryCode,
      },
    })
  ).pipe(
    map((response: ApolloQueryResult<any>) => {
      if (
        !response.data?.collection?.products.nodes.length ||
        response.error ||
        response.errors?.length
      ) {
        throw new Error(`Shopify request failed: ${JSON.stringify(response)}`);
      }

      return response.data.collection;
    }),
    map((shopifyCollection) =>
      mapShopifyProductsToCocoProduct(
        shopifyCollection.products.nodes,
        productSlug,
        shopifyCollection.description
      )
    )
  );
};

/*
    ALL OF THE METHODS BELOW WERE COPIED (AND CLEANED UP) FROM 'src/app/common/utils/shopify-product-helpers.ts'
*/

const mapShopifyProductsToCocoProduct = (
  shopifyProducts: any[],
  productSlug: string,
  productDescription: string
) => {
  const variants = shopifyProducts.flatMap((shopifyProduct) => {
    const { serie, color, tier } = parseProductVariantAttributes(
      productSlug,
      shopifyProduct.handle
    );

    const discountPercent = getDiscountPercentFromTags(shopifyProduct.tags);

    const validShopifyProductVariants = shopifyProduct.variants.nodes.filter(
      (shopifyProductVariant) => {
        const selectedModels = shopifyProductVariant.selectedOptions
          .filter((option) => option.name.toLocaleLowerCase().includes('model'))
          .map((option) => option.value);

        return selectedModels.every((model) => model === selectedModels[0]);
      }
    );

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
          model: model || defaultProductModel,
          color,
          tier,
          images: shopifyProduct.images.nodes.map((shopifyImage) => ({
            src: shopifyImage.url,
            alt: shopifyImage.altText || undefined,
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

          productVariant.price = applyDiscount(
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
    description: productDescription,
    variants,
  };
};

const parseProductVariantAttributes = (
  productSlug: string,
  productHandle: string
) => {
  const expectedOptions = expectedProductOptions.get(productSlug);

  if (!expectedOptions) {
    throw new Error(`Unrecognizable product handle: ${productHandle}`);
  }

  const handleWithoutProductSlug = productHandle.replace(`${productSlug}-`, '');

  const handleParts = handleWithoutProductSlug.split('-');

  if (handleParts.length < 2 || handleParts[0] !== 'iphone') {
    throw new Error(`Unexpected product handle format: ${productHandle}`);
  }

  let serie = handleParts[1];

  let handleRemainder = handleWithoutProductSlug.replace(`iphone-${serie}`, '');

  let color: string | undefined = undefined;

  if (expectedOptions.includes('color')) {
    color = productColors.find((productColor) =>
      handleRemainder.includes(productColor)
    );

    if (!color) {
      throw new Error('Expected color should not be null or undefined');
    }

    handleRemainder = handleRemainder.replace(color, '');
  }

  let tier: string | undefined = undefined;

  if (expectedOptions.includes('tier')) {
    tier = productTiers.find((productTier) =>
      handleRemainder.includes(productTier)
    );

    if (!tier) {
      throw new Error('Expected tier should not be null or undefined');
    }

    handleRemainder = handleRemainder.replace(tier, '');
  }

  serie += handleRemainder.substring(0, handleRemainder.length - 1);

  return { serie, color, tier };
};

export const getDiscountPercentFromTags = (
  tags: string[]
): number | undefined => {
  const saleTag = tags.find((tag) =>
    tag.toLocaleLowerCase().includes(discountedProductTagPrefix)
  );

  return saleTag ? parseFloat(saleTag.split('-')[1]) : undefined;
};

export const applyDiscount = (price: Money, discountPercent: number): Money => {
  const remainingPercent = 1 - discountPercent / 100;

  return {
    amount: Math.ceil(price.amount * remainingPercent),
    currencyCode: price.currencyCode,
  };
};
