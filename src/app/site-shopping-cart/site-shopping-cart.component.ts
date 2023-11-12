import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ShoppingCart } from '../models/shopping-cart.model';
import { ShopifyProductService } from '../services/shopify-product.service';
import { Money } from '../models/new-product.model';

@Component({
  selector: 'app-site-shopping-cart',
  templateUrl: './site-shopping-cart.component.html',
  styleUrls: ['./site-shopping-cart.component.scss'],
})
export class SiteShoppingCartComponent implements OnInit, OnDestroy {
  cartSub!: Subscription;
  cart: ShoppingCart | null = null;

  freeShippingSub!: Subscription;
  freeShippingThreshold: Money | null = null;

  constructor(
    private readonly router: Router,
    private readonly viewportScroller: ViewportScroller,
    private readonly shoppingCartService: ShoppingCartService,
    private readonly shopifyProductService: ShopifyProductService
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

    const urlTree = this.router.createUrlTree(['/'], { fragment: 'products' });

    if (
      this.router.isActive(urlTree, {
        paths: 'exact',
        fragment: 'exact',
        matrixParams: 'ignored',
        queryParams: 'ignored',
      })
    ) {
      this.viewportScroller.scrollToAnchor('products');
    } else {
      this.router.navigate(['/'], { fragment: 'products' });
    }
  }
}
