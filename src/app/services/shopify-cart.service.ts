import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { catchAndReportError } from '../common/utils/catch-and-report-error.operator';
import { LineItem, ShoppingCart } from '../models/shopping-cart.model';
import {
  AddLineItemGQL,
  CartGQL,
  CreateCartGQL,
  RemoveLineItemGQL,
  SetLineItemQuantityGQL,
  ShoppingCartFragment,
} from '../graphql/types';
import { expectedProductOptions } from '../models/product.model';
import { LocationService } from './location.service';
import { NotificationService } from './notification.service';
import { ShopifyProductService } from './shopify-product.service';

@Injectable({
  providedIn: 'root',
})
export class ShopifyCartService {
  constructor(
    private readonly locationService: LocationService,
    private readonly notificationService: NotificationService,
    private readonly shopifyProductService: ShopifyProductService,
    private readonly addLineItemGQL: AddLineItemGQL,
    private readonly removeLineItemGQL: RemoveLineItemGQL,
    private readonly cartGQL: CartGQL,
    private readonly createCartGQL: CreateCartGQL,
    private readonly setLineItemQuantityGQL: SetLineItemQuantityGQL
  ) {}

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

    const lines: LineItem[] = cartFragment.lines.nodes.map(
      (shopifyLineItem) => {
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

        const { serie, color, tier } =
          this.shopifyProductService.parseProductVariantAttributes(
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
      }
    );

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
  }
}
