import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription, distinctUntilChanged, filter, map, skip } from 'rxjs';
import { ShoppingCartService } from './services/shopping-cart.service';
import { ScrollBlockerService } from './services/scroll-blocker.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  cartIsVisibleSubscription?: Subscription;
  cartIsVisible = false;
  drawerIsVisible = false;

  constructor(
    private readonly router: Router,
    private readonly shoppingCartService: ShoppingCartService,
    private readonly scrollBlockerService: ScrollBlockerService
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter(
          (event) => event instanceof NavigationStart && this.drawerIsVisible
        ),
        map((event) => event as NavigationStart)
      )
      .subscribe(() => {
        this.scrollBlockerService.unblockPageScroll();
        this.drawerIsVisible = false;
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
