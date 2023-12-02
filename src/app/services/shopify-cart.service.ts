import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { catchAndReportError } from '../common/utils/catch-and-report-error.operator';
import {
  AddLineItemGQL,
  CartGQL,
  CreateCartGQL,
  RemoveLineItemGQL,
  SetLineItemQuantityGQL,
} from '../graphql/types';
import { LocationService } from './location.service';
import { NotificationService } from './notification.service';
import { mapCart } from '../common/utils/shopify-cart-helpers';

@Injectable({
  providedIn: 'root',
})
export class ShopifyCartService {
  constructor(
    private locationService: LocationService,
    private notificationService: NotificationService,
    private addLineItemGQL: AddLineItemGQL,
    private removeLineItemGQL: RemoveLineItemGQL,
    private cartGQL: CartGQL,
    private createCartGQL: CreateCartGQL,
    private setLineItemQuantityGQL: SetLineItemQuantityGQL
  ) {}

  createCart(variantId: string) {
    return this.locationService.getTwoLetterCountryCode().pipe(
      switchMap((countryCode) =>
        this.createCartGQL
          .mutate({
            variantId,
            countryCode,
          })
          .pipe(map((response) => mapCart(response.data?.cartCreate?.cart)))
      ),
      catchAndReportError(this.notificationService)
    );
  }

  fetchCart(cartId: string) {
    return this.cartGQL.fetch({ cartId }).pipe(
      map((response) => response.data?.cart),
      map((cart) => (cart ? mapCart(cart) : null)),
      catchAndReportError(this.notificationService)
    );
  }

  addLineItem(cartId: string, variantId: string) {
    return this.addLineItemGQL.mutate({ cartId, variantId }).pipe(
      map((response) => mapCart(response.data?.cartLinesAdd?.cart)),
      catchAndReportError(this.notificationService)
    );
  }

  setLineItemQuantity(cartId: string, itemId: string, quantity: number) {
    return this.setLineItemQuantityGQL
      .mutate({ cartId, itemId, quantity })
      .pipe(
        map((response) => mapCart(response.data?.cartLinesUpdate?.cart)),
        catchAndReportError(this.notificationService)
      );
  }

  removeLineItem(cartId: string, itemId: string) {
    return this.removeLineItemGQL.mutate({ cartId, itemId }).pipe(
      map((response) => mapCart(response.data?.cartLinesRemove?.cart)),
      catchAndReportError(this.notificationService)
    );
  }
}
