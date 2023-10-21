import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-site-shopping-cart',
  templateUrl: './site-shopping-cart.component.html',
  styleUrls: ['./site-shopping-cart.component.scss'],
})
export class SiteShoppingCartComponent implements OnInit, OnDestroy {
  cartSub?: Subscription;
  cart?: any;

  constructor(
    private readonly router: Router,
    private readonly viewportScroller: ViewportScroller,
    private readonly shoppingCartService: ShoppingCartService
  ) {}

  ngOnInit() {
    this.cartSub = this.shoppingCartService.cart$.subscribe(
      (cart) => (this.cart = cart)
    );
  }

  ngOnDestroy() {
    this.cartSub?.unsubscribe();
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
