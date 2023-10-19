import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, distinctUntilChanged, skip } from 'rxjs';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ScrollBlockerService } from '../services/scroll-blocker.service';

@Component({
  selector: 'app-site-shopping-cart',
  templateUrl: './site-shopping-cart.component.html',
  styleUrls: ['./site-shopping-cart.component.scss'],
})
export class SiteShoppingCartComponent implements OnInit, OnDestroy {
  cartIsVisibleSub?: Subscription;
  cartSub?: Subscription;
  cart?: any;

  constructor(
    private readonly router: Router,
    private readonly viewportScroller: ViewportScroller,
    private readonly shoppingCartService: ShoppingCartService,
    private readonly scrollBlockerService: ScrollBlockerService
  ) {}

  ngOnInit() {
    this.cartSub = this.shoppingCartService.cart$.subscribe(
      (cart) => (this.cart = cart)
    );

    this.cartIsVisibleSub = this.shoppingCartService.isCartVisible$
      .pipe(distinctUntilChanged(), skip(1))
      .subscribe((isVisible) => {
        if (isVisible) {
          this.scrollBlockerService.blockPageScroll();
        } else {
          this.scrollBlockerService.unblockPageScroll();
        }
      });
  }

  ngOnDestroy() {
    this.cartSub?.unsubscribe();
    this.cartIsVisibleSub?.unsubscribe();
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

  checkOut() {
    //
  }
}
