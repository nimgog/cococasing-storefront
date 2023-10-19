import { Injectable } from '@angular/core';
import { BehaviorSubject, of, switchMap, tap } from 'rxjs';
import { ShopifyService } from './shopify.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private readonly cartIsVisibleSubject = new BehaviorSubject(false);
  private readonly cartSubject = new BehaviorSubject<any>(null);

  constructor(
    private readonly shopifyService: ShopifyService,
    private readonly localStorageService: LocalStorageService
  ) {}

  get isCartVisible$() {
    return this.cartIsVisibleSubject.asObservable();
  }

  get cart$() {
    return this.cartSubject.asObservable().pipe(
      switchMap((cart: any) => {
        if (!cart) {
          const cartId =
            this.localStorageService.get<string>('shopify:cart_id');

          if (!cartId) {
            return of(null);
          }

          return this.shopifyService.fetchCart(cartId).pipe(
            tap((cart) => console.log(cart)),
            tap((cart) => this.cartSubject.next(cart))
          );
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

  addLineItem(variantId: string, quantity: number) {
    return of(this.cartSubject.value).pipe(
      switchMap((cart: any) => {
        if (!cart) {
          const cartId =
            this.localStorageService.get<string>('shopify:cart_id');

          if (cartId) {
            return this.shopifyService.fetchCart(cartId);
          }
        }

        return of(cart);
      }),
      switchMap((cart: any) => {
        if (cart) {
          return this.shopifyService.addLineItem(cart.id, variantId);
        }

        return this.shopifyService
          .createCart(variantId)
          .pipe(
            tap((cart: any) =>
              this.localStorageService.set('shopify:cart_id', cart.id)
            )
          );
      }),
      tap((cart) => this.cartSubject.next(cart))
    );
  }

  removeLineItem(itemId: string) {
    return this.shopifyService
      .removeLineItem(this.cartSubject.value.id, itemId)
      .pipe(tap((cart: any) => this.cartSubject.next(cart)));
  }

  setQuantity(itemId: string, quantity: number) {
    if (quantity === 0) {
      return this.removeLineItem(itemId);
    }

    return this.shopifyService
      .setLineItemQuantity(this.cartSubject.value.id, itemId, quantity)
      .pipe(tap((cart: any) => this.cartSubject.next(cart)));
  }
}
