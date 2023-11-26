import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription, of, switchMap, tap } from 'rxjs';
import { ShopifyCartService } from './shopify-cart.service';
import { ShopifyProductService } from './shopify-product.service';
import { LocalStorageService } from './local-storage.service';
import { ShoppingCart } from '../models/shopping-cart.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService implements OnDestroy {
  private readonly cartIsVisibleSubject = new BehaviorSubject(false);
  private readonly cartSubject = new BehaviorSubject<ShoppingCart | null>(null);
  private readonly productPriceRefreshSignalSub!: Subscription;

  constructor(
    private readonly shopifyCartService: ShopifyCartService,
    private readonly shopifyProductService: ShopifyProductService,
    private readonly localStorageService: LocalStorageService,
    private readonly notificationService: NotificationService
  ) {
    this.productPriceRefreshSignalSub =
      this.shopifyProductService.productPriceRefreshSignal$.subscribe(() =>
        this.cartSubject.next(null)
      );
  }

  ngOnDestroy() {
    this.productPriceRefreshSignalSub.unsubscribe();
  }

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

          return this.shopifyCartService
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
            return this.shopifyCartService.fetchCart(cartId);
          }
        }

        return of(cart);
      }),
      switchMap((cart) => {
        if (cart) {
          return this.shopifyCartService.addLineItem(cart.id, variantId);
        }

        return this.shopifyCartService
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

    return this.shopifyCartService
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

    return this.shopifyCartService
      .setLineItemQuantity(cart.id, itemId, quantity)
      .pipe(tap((cart) => this.cartSubject.next(cart)));
  }
}
