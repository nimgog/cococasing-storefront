import { Component, Input } from '@angular/core';
import { FeaturedProduct } from 'src/app/models/new-product.model';

@Component({
  selector: 'app-product-highlighter',
  templateUrl: './product-highlighter.component.html',
  styleUrls: ['./product-highlighter.component.scss'],
})
export class ProductHighlighterComponent {
  @Input()
  products: FeaturedProduct[] = [];

  isNewProduct(product: FeaturedProduct) {
    return !product.originalPrice;
  }

  getProductAnnouncement(product: FeaturedProduct) {
    return this.isNewProduct(product)
      ? 'New In'
      : `${product.discountPercent}% Sale`;
  }
}
