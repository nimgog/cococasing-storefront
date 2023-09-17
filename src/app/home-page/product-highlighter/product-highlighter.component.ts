import { Component, Input, OnInit } from '@angular/core';
import { FeaturedProduct } from '../featured-product';

@Component({
  selector: 'app-product-highlighter',
  templateUrl: './product-highlighter.component.html',
  styleUrls: ['./product-highlighter.component.scss'],
})
export class ProductHighlighterComponent implements OnInit {
  @Input()
  firstProduct!: FeaturedProduct;

  @Input()
  secondProduct!: FeaturedProduct;

  products!: FeaturedProduct[];

  ngOnInit(): void {
    if (!this.firstProduct) {
      throw new Error('The first product must be provided.');
    }

    if (!this.secondProduct) {
      throw new Error('The second product must be provided.');
    }

    this.products = [this.firstProduct, this.secondProduct];
  }

  isNewProduct(product: FeaturedProduct) {
    return !product.discount;
  }

  getProductAnnouncement(product: FeaturedProduct) {
    return !product.discount
      ? 'New in'
      : `${product.discount.discountPercent}% sale`;
  }
}
