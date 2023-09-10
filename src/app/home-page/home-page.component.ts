import { Component } from '@angular/core';
import { SlideProduct } from '../product-slider/slide-product';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  currentYear = new Date().getFullYear();

  firstSliderProduct: SlideProduct = {
    id: 'first',
    name: 'Forest Green',
    description: 'A green guard for your gadget',
    imageUrl: '/assets/img/home/promoted_products/forest_green_case.png',
    price: 599,
    devisa: 'SEK',
  };

  secondSliderProduct: SlideProduct = {
    id: 'second',
    name: 'French Lavender',
    description: 'A lavender haven for you',
    imageUrl: '/assets/img/home/promoted_products/french_lavender_case.png',
    discount: {
      discountPercent: 30,
      oldPrice: 599,
    },
    price: 499,
    devisa: 'SEK',
  };

  instagramGalleryImages: { src: string; alt: string }[] = [...Array(9)].map(
    (_, i) => ({
      src: `/assets/img/home/instagram_gallery/ig_${i + 1}.png`,
      alt: `Instagram image #${i + 1}`,
    })
  );

  paymentOptionImages: { src: string; alt: string }[] = [
    { id: 'amex', name: 'American Express' },
    { id: 'apple', name: 'Apple Pay' },
    { id: 'google', name: 'Google Pay' },
    { id: 'klarna', name: 'Klarna' },
    { id: 'maestro', name: 'Maestro' },
    { id: 'mastercard', name: 'Mastercard' },
    { id: 'shop', name: 'Shop Pay' },
    { id: 'union', name: 'UnionPay' },
    { id: 'visa', name: 'Visa' },
  ].map((option) => ({
    src: `/assets/img/home/payment/${option.id}.png`,
    alt: option.name,
  }));
}
