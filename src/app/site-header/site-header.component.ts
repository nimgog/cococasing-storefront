import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { Subscription } from 'rxjs';

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

  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  ngOnInit() {
    this.cartSub = this.shoppingCartService.cart$.subscribe(
      (cart) => (this.cartTotalQuantity = cart?.totalQuantity || 0)
    );
  }

  ngOnDestroy() {
    this.cartSub?.unsubscribe();
  }

  openCart() {
    this.shoppingCartService.openCart();
  }

  onHamburgerMenuClick() {
    this.hamburgerMenuClick.emit();
  }
}
