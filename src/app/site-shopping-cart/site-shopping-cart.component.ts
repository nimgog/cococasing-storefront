import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { NavigationService } from '../services/navigation.service';
import { ShoppingCart } from '../models/shopping-cart.model';
import { ShopifyProductService } from '../services/shopify-product.service';
import { Money } from '../models/product.model';

@Component({
  selector: 'app-site-shopping-cart',
  templateUrl: './site-shopping-cart.component.html',
})
export class SiteShoppingCartComponent implements OnInit, OnDestroy {
  cartSub!: Subscription;
  cart: ShoppingCart | null = null;

  freeShippingSub!: Subscription;
  freeShippingThreshold: Money | null = null;

  constructor(
    private navigationService: NavigationService,
    private shoppingCartService: ShoppingCartService,
    private shopifyProductService: ShopifyProductService
  ) {}

  get shippingInfo() {
    if (
      this.cart &&
      this.freeShippingThreshold &&
      this.cart.totalPrice.amount >= this.freeShippingThreshold.amount
    ) {
      return 'Shipping is free.';
    }

    return 'Shipping calculated at checkout.';
  }

  ngOnInit() {
    this.cartSub = this.shoppingCartService.cart$.subscribe(
      (cart) => (this.cart = cart)
    );

    this.freeShippingSub = this.shopifyProductService
      .fetchFreeShippingThreshold()
      .subscribe((threshold) => (this.freeShippingThreshold = threshold));
  }

  ngOnDestroy() {
    this.cartSub.unsubscribe();
    this.freeShippingSub.unsubscribe();
  }

  closeCart() {
    this.shoppingCartService.closeCart();
  }

  navigateToProducts() {
    this.closeCart();
    this.navigationService.navigateToProducts();
  }
}
