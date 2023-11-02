import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { Subscription } from 'rxjs';
import { ShopifyService } from '../services/shopify.service';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.scss'],
})
export class SiteHeaderComponent implements OnInit, OnDestroy {
  @Output()
  hamburgerMenuClick: EventEmitter<void> = new EventEmitter();

  cartSub?: Subscription;
  cartTotalQuantity = 0;

  freeShippingSub?: Subscription;
  freeShippingThreshold: string | null = null;

  constructor(
    private readonly shoppingCartService: ShoppingCartService,
    private readonly shopifyService: ShopifyService
  ) {}

  ngOnInit() {
    this.cartSub = this.shoppingCartService.cart$.subscribe(
      (cart) => (this.cartTotalQuantity = cart?.totalQuantity || 0)
    );

    this.freeShippingSub = this.shopifyService
      .fetchFreeShippingThreshold()
      .subscribe(
        (threshold) =>
          (this.freeShippingThreshold = threshold
            ? `${threshold.amount} ${threshold.currencyCode}`
            : null)
      );
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
