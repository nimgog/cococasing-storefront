import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { SlideProduct } from './slide-product';

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.scss'],
  animations: [
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
      transition(':leave', [
        animate('400ms ease-in-out', style({ opacity: 0 })),
      ]),
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
  ],
})
export class ProductSliderComponent implements OnInit {
  @Input()
  firstProduct!: SlideProduct;

  @Input()
  secondProduct!: SlideProduct;

  @Input()
  allowSlideBeyondEnds = true;

  products!: SlideProduct[];
  currentProductIndex = 0;

  ngOnInit(): void {
    if (!this.firstProduct) {
      throw new Error('The first product must be provided.');
    }

    if (!this.secondProduct) {
      throw new Error('The second product must be provided.');
    }

    this.products = [this.firstProduct, this.secondProduct];
  }

  get leftControlEnabled() {
    return this.allowSlideBeyondEnds || this.currentProductIndex !== 0;
  }

  get rightControlEnabled() {
    return (
      this.allowSlideBeyondEnds ||
      this.currentProductIndex !== this.products.length - 1
    );
  }

  isNewProduct(product: SlideProduct) {
    return !product.discount;
  }

  isDiscountedProduct(product: SlideProduct) {
    return !!product.discount;
  }

  getProductAnnouncement(product: SlideProduct) {
    return !product.discount
      ? 'New in'
      : `${product.discount.discountPercent}% sale`;
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
