import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input } from '@angular/core';
import type { FeaturedProduct } from 'src/app/models/product.model';

const animations = [
  trigger('slideAnimation', [
    transition(':increment', [
      style({ transform: 'translateX(-100%)', opacity: 1 }),
      animate(
        '400ms ease-in-out',
        style({ transform: 'translateX(0%)', opacity: 1 })
      ),
    ]),
    transition(':decrement', [
      style({ transform: 'translateX(100%)', opacity: 1 }),
      animate(
        '400ms ease-in-out',
        style({ transform: 'translateX(0%)', opacity: 1 })
      ),
    ]),
    transition(':leave', [animate('400ms ease-in-out', style({ opacity: 0 }))]),
  ]),
  trigger('fadeAnimation', [
    state('shown', style({ opacity: 1 })),
    state('hidden', style({ opacity: 0 })),
    transition('shown <=> hidden', [animate('400ms ease-in-out')]),
  ]),
  trigger('swapColorAnimation', [
    state('selected', style({ 'background-color': '#F97316' })),
    state('unselected', style({ 'background-color': '#D9D9D9' })),
    transition('selected <=> unselected', [animate('400ms ease-in-out')]),
  ]),
];

@Component({
  selector: 'app-featured-products',
  templateUrl: './featured-products.component.html',
  animations,
})
export class FeaturedProductsComponent {
  @Input()
  products: FeaturedProduct[] = [];

  @Input()
  allowSlideBeyondEnds = true;

  // @Input()
  // hideArrows = false;

  currentProductIndex = 0;

  get leftControlEnabled() {
    return this.allowSlideBeyondEnds || this.currentProductIndex !== 0;
  }

  get rightControlEnabled() {
    return (
      this.allowSlideBeyondEnds ||
      this.currentProductIndex !== this.products.length - 1
    );
  }

  isNewProduct(product: FeaturedProduct) {
    return !product.originalPrice;
  }

  getProductAnnouncement(product: FeaturedProduct) {
    return product.discountPercent
      ? `${product.discountPercent}% Sale`
      : 'New In';
  }

  showPreviousProduct() {
    if (!this.leftControlEnabled) {
      return;
    }

    if (this.currentProductIndex > 0) {
      this.currentProductIndex--;
    } else {
      this.currentProductIndex = this.products.length - 1;
    }
  }

  showNextProduct() {
    if (!this.rightControlEnabled) {
      return;
    }

    if (this.currentProductIndex < this.products.length - 1) {
      this.currentProductIndex++;
    } else {
      this.currentProductIndex = 0;
    }
  }

  selectProduct(productIndex: number) {
    this.currentProductIndex = productIndex;
  }
}
