import { Component } from '@angular/core';
import { SlideProduct } from './product-slider/slide-product';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  firstSliderProduct: SlideProduct = {
    id: 'first',
    name: 'Forest Green',
    description: 'A green guard for your gadget',
    imageUrl: '/assets/img/home-page/forest-green-case.png',
    price: 599,
    devisa: 'SEK',
  };

  secondSliderProduct: SlideProduct = {
    id: 'second',
    name: 'French Lavender',
    description: 'A lavender haven for you',
    imageUrl: '/assets/img/home-page/french-lavender-case.png',
    discount: {
      discountPercent: 30,
      oldPrice: 599,
    },
    price: 499,
    devisa: 'SEK',
  };
}
