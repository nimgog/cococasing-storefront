import type { OnDestroy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import type { Subscription } from 'rxjs';
import type { FeaturedProduct } from '../models/product.model';
import { ShopifyProductService } from '../services/shopify-product.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit, OnDestroy {
  featuredProductsSub!: Subscription;
  featuredProducts: FeaturedProduct[] = [];

  constructor(private shopifyProductService: ShopifyProductService) {}

  ngOnInit() {
    this.featuredProductsSub = this.shopifyProductService
      .fetchFeaturedProducts()
      .subscribe(
        (featuredProducts) => (this.featuredProducts = featuredProducts)
      );
  }

  ngOnDestroy() {
    this.featuredProductsSub.unsubscribe();
  }
}
