import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.scss'],
})
export class SiteHeaderComponent implements OnInit, OnDestroy {
  cartSub?: Subscription;
  cartTotalQuantity = 0;

  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  ngOnInit() {
    this.cartSub = this.shoppingCartService.cart$.subscribe(
      (cart) => (this.cartTotalQuantity = cart.totalQuantity)
    );
  }

  ngOnDestroy() {
    this.cartSub?.unsubscribe();
  }

  openCart() {
    this.shoppingCartService.openCart();
  }
}
