import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FeaturedProduct } from '../models/new-product.model';
import { ShopifyService } from '../services/shopify.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  featuredProductsSub!: Subscription;
  featuredProducts: FeaturedProduct[] = [];

  constructor(private readonly shopifyService: ShopifyService) {}

  ngOnInit() {
    this.featuredProductsSub = this.shopifyService
      .fetchFeaturedProducts()
      .subscribe(
        (featuredProducts) => (this.featuredProducts = featuredProducts)
      );
  }

  ngOnDestroy() {
    this.featuredProductsSub.unsubscribe();
  }
}
