import type { OnDestroy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import type { Subscription } from 'rxjs';
import { distinctUntilChanged, skip } from 'rxjs';
import { ShoppingCartService } from './services/shopping-cart.service';
import { ScrollBlockerService } from './services/scroll-blocker.service';

// TODO: Get rid of unused old global styles
// TODO: Upgrade to Angular 16
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  cartIsVisibleSubscription?: Subscription;
  cartIsVisible = false;
  drawerIsVisible = false;

  constructor(
    private router: Router,
    private shoppingCartService: ShoppingCartService,
    private scrollBlockerService: ScrollBlockerService
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart && this.drawerIsVisible) {
        this.scrollBlockerService.unblockPageScroll();
        this.drawerIsVisible = false;
      }
    });

    this.cartIsVisibleSubscription = this.shoppingCartService.isCartVisible$
      .pipe(distinctUntilChanged(), skip(1))
      .subscribe((isVisible) => {
        if (isVisible) {
          this.scrollBlockerService.blockPageScroll();
        } else {
          this.scrollBlockerService.unblockPageScroll();
        }

        this.cartIsVisible = isVisible;
      });
  }

  ngOnDestroy() {
    this.cartIsVisibleSubscription?.unsubscribe();
  }

  onHamburgerMenuClick() {
    this.scrollBlockerService.blockPageScroll();
    this.drawerIsVisible = true;
  }

  onDrawerClose() {
    this.scrollBlockerService.unblockPageScroll();
    this.drawerIsVisible = false;
  }
}
