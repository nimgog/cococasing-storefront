import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FeaturedProduct } from '../models/new-product.model';
import { ShopifyProductService } from '../services/shopify-product.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  featuredProductsSub!: Subscription;
  featuredProducts: FeaturedProduct[] = [];

  constructor(private readonly shopifyProductService: ShopifyProductService) {}

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
