import { Injectable } from '@angular/core';
import { BehaviorSubject, of, switchMap, tap } from 'rxjs';
import { ShopifyService } from './shopify.service';
import { LocalStorageService } from './local-storage.service';
import { ShoppingCart } from '../models/shopping-cart.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private readonly cartIsVisibleSubject = new BehaviorSubject(false);
  private readonly cartSubject = new BehaviorSubject<ShoppingCart | null>(null);

  constructor(
    private readonly shopifyService: ShopifyService,
    private readonly localStorageService: LocalStorageService,
    private readonly notificationService: NotificationService
  ) {}

  get isCartVisible$() {
    return this.cartIsVisibleSubject.asObservable();
  }

  get cart$() {
    return this.cartSubject.asObservable().pipe(
      switchMap((cart) => {
        if (!cart) {
          const cartId =
            this.localStorageService.get<string>('shopify:cart_id');

          if (!cartId) {
            return of(null);
          }

          return this.shopifyService
            .fetchCart(cartId)
            .pipe(tap((cart) => this.cartSubject.next(cart)));
        }

        return of(cart);
      })
    );
  }

  openCart() {
    this.cartIsVisibleSubject.next(true);
  }

  closeCart() {
    this.cartIsVisibleSubject.next(false);
  }

  addLineItem(variantId: string) {
    return of(this.cartSubject.value).pipe(
      switchMap((cart) => {
        if (!cart) {
          const cartId =
            this.localStorageService.get<string>('shopify:cart_id');

          if (cartId) {
            return this.shopifyService.fetchCart(cartId);
          }
        }

        return of(cart);
      }),
      switchMap((cart) => {
        if (cart) {
          return this.shopifyService.addLineItem(cart.id, variantId);
        }

        return this.shopifyService
          .createCart(variantId)
          .pipe(
            tap((cart) =>
              this.localStorageService.set('shopify:cart_id', cart.id)
            )
          );
      }),
      tap((cart) => this.cartSubject.next(cart))
    );
  }

  removeLineItem(itemId: string) {
    const cart = this.cartSubject.value;

    if (!cart) {
      this.notificationService.showUnknownErrorMessage();
      throw new Error('Could not remove line item - cart is unavailable');
    }

    return this.shopifyService
      .removeLineItem(cart.id, itemId)
      .pipe(tap((cart) => this.cartSubject.next(cart)));
  }

  setQuantity(itemId: string, quantity: number) {
    if (quantity === 0) {
      return this.removeLineItem(itemId);
    }

    const cart = this.cartSubject.value;

    if (!cart) {
      this.notificationService.showUnknownErrorMessage();
      throw new Error('Could not remove line item - cart is unavailable');
    }

    return this.shopifyService
      .setLineItemQuantity(cart.id, itemId, quantity)
      .pipe(tap((cart) => this.cartSubject.next(cart)));
  }
}
