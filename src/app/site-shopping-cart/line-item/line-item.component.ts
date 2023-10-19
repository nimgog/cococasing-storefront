import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, switchMap } from 'rxjs';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-line-item',
  templateUrl: './line-item.component.html',
  styleUrls: ['./line-item.component.scss'],
})
export class LineItemComponent implements OnInit, OnDestroy {
  private readonly quantitySubject = new Subject<number>();
  private updateQuantitySub?: Subscription;

  @Input()
  lineItem: any;

  constructor(private readonly shoppingCartService: ShoppingCartService) {}

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
