import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription, filter, map } from 'rxjs';
import { ShoppingCartService } from './services/shopping-cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  cartIsVisibleSubscription?: Subscription;
  useNewLayout = false;
  cartIsVisible = false;

  constructor(
    private readonly router: Router,
    private readonly shoppingCartService: ShoppingCartService
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        map((event) => event as NavigationStart)
      )
      .subscribe(
        (event) => (this.useNewLayout = !event.url.startsWith('/products'))
      );

    this.cartIsVisibleSubscription =
      this.shoppingCartService.isCartVisible$.subscribe(
        (cartIsVisible) => (this.cartIsVisible = cartIsVisible)
      );
  }

  ngOnDestroy() {
    this.cartIsVisibleSubscription?.unsubscribe();
  }
}
