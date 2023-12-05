import type { ShoppingCartFragment } from 'src/app/graphql/types';
import { expectedProductOptions } from 'src/app/models/product.model';
import type {
  LineItem,
  ShoppingCart,
} from 'src/app/models/shopping-cart.model';
import { parseProductVariantAttributes } from './shopify-product-helpers';

export const mapCart = (
  cartFragment: ShoppingCartFragment | null | undefined
): ShoppingCart => {
  if (!cartFragment) {
    throw new Error('Failed to map cart as it was unavailable');
  }

  const lines: LineItem[] = cartFragment.lines.nodes.map((shopifyLineItem) => {
    const {
      merchandise: {
        id: productId,
        product,
        selectedOptions,
        image: productImage,
      },
    } = shopifyLineItem;

    const allProductSlugs = [...expectedProductOptions.keys()];
    const productSlug = allProductSlugs.find((slug) =>
      product.handle.includes(slug)
    );

    if (!productSlug) {
      throw new Error('Unrecognizable product handle: ' + product.handle);
    }

    const { serie, color, tier } = parseProductVariantAttributes(
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

    const lineItem: LineItem = {
      id: shopifyLineItem.id,
      product: {
        id: productId,
        title: `${productSlug}-iphone-${serie}${model ? `-${model}` : ''}`,
        subtitle: subtitleParts.join('-'),
        imageUrl: productImage?.url,
      },
      totalPrice: {
        amount: parseFloat(shopifyLineItem.cost.totalAmount.amount),
        currencyCode: shopifyLineItem.cost.totalAmount.currencyCode,
      },
      quantity: shopifyLineItem.quantity,
    };

    const lineItemOriginalTotalPrice = {
      amount: parseFloat(shopifyLineItem.cost.subtotalAmount.amount),
      currencyCode: shopifyLineItem.cost.subtotalAmount.currencyCode,
    };

    if (lineItem.totalPrice.amount < lineItemOriginalTotalPrice.amount) {
      lineItem.originalTotalPrice = lineItemOriginalTotalPrice;
    }

    return lineItem;
  });

  const cart: ShoppingCart = {
    id: cartFragment.id,
    checkoutUrl: cartFragment.checkoutUrl,
    lines,
    totalPrice: {
      amount: parseFloat(cartFragment.cost.totalAmount.amount),
      currencyCode: cartFragment.cost.totalAmount.currencyCode,
    },
    totalQuantity: cartFragment.totalQuantity,
  };

  const cartOriginalTotalPrice = {
    amount: lines
      .map((lineItem) => lineItem.originalTotalPrice || lineItem.totalPrice)
      .reduce((sum, currentPrice) => sum + currentPrice.amount, 0),
    currencyCode: cartFragment.cost.totalAmount.currencyCode,
  };

  if (cart.totalPrice.amount < cartOriginalTotalPrice.amount) {
    cart.originalTotalPrice = cartOriginalTotalPrice;
  }

  return cart;
};
