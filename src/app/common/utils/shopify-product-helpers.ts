import { ProductQuery } from 'src/app/graphql/types';
import {
  Money,
  Product,
  ProductVariant,
  defaultProductModel,
  discountedProductTagPrefix,
  expectedProductOptions,
  productColors,
  productTiers,
} from 'src/app/models/product.model';

type ShopifyCollection = NonNullable<ProductQuery['collection']>;
type ShopifyProductConnection = NonNullable<ShopifyCollection['products']>;
type ShopifyProductNodes = NonNullable<ShopifyProductConnection['nodes']>;
type ShopifyProduct = ShopifyProductNodes[number];

export const mapShopifyProductsToCocoProduct = (
  shopifyProducts: ShopifyProduct[],
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

export const parseProductVariantAttributes = (
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
