import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { Subscription } from 'rxjs';
import { ShopifyProductService } from '../services/shopify-product.service';
import { isScullyRunning } from '@scullyio/ng-lib';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
})
export class SiteHeaderComponent implements OnInit, OnDestroy {
  @Output()
  hamburgerMenuClick: EventEmitter<void> = new EventEmitter();

  cartSub?: Subscription;
  cartTotalQuantity = 0;

  freeShippingSub?: Subscription;
  freeShippingText = '&nbsp';

  constructor(
    private shoppingCartService: ShoppingCartService,
    private shopifyProductService: ShopifyProductService
  ) {}

  ngOnInit() {
    if (!isScullyRunning()) {
      this.cartSub = this.shoppingCartService.cart$.subscribe(
        (cart) => (this.cartTotalQuantity = cart?.totalQuantity || 0)
      );

      this.freeShippingSub = this.shopifyProductService
        .fetchFreeShippingThreshold()
        .subscribe(
          (threshold) =>
            (this.freeShippingText = threshold
              ? `Free shippings on order over ${threshold.amount} ${threshold.currencyCode}!`
              : '&nbsp')
        );
    }
  }

  ngOnDestroy() {
    this.cartSub?.unsubscribe();
    this.freeShippingSub?.unsubscribe();
  }

  openCart() {
    this.shoppingCartService.openCart();
  }

  onHamburgerMenuClick() {
    this.hamburgerMenuClick.emit();
  }
}
