import type { OnDestroy, OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import type { Subscription } from 'rxjs';
import { Subject, switchMap } from 'rxjs';
import type { LineItem } from 'src/app/models/shopping-cart.model';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-line-item',
  templateUrl: './line-item.component.html',
})
export class LineItemComponent implements OnInit, OnDestroy {
  private quantitySubject = new Subject<number>();
  private updateQuantitySub?: Subscription;

  @Input()
  lineItem!: LineItem;

  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit() {
    this.updateQuantitySub = this.quantitySubject
      .asObservable()
      .pipe(
        switchMap((quantity) =>
          this.shoppingCartService.setQuantity(this.lineItem.id, quantity)
        )
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.updateQuantitySub?.unsubscribe();
  }

  increaseQuantity() {
    this.lineItem.quantity++;
    this.quantitySubject.next(this.lineItem.quantity);
  }

  decreaseQuantity() {
    if (this.lineItem.quantity === 1) {
      return;
    }

    this.lineItem.quantity--;
    this.quantitySubject.next(this.lineItem.quantity);
  }

  removeLineItem() {
    this.quantitySubject.next(0);
  }
}
