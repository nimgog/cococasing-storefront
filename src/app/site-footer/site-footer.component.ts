import { Component } from '@angular/core';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.component.html',
})
export class SiteFooterComponent {
  socialMediaLinks: { title: string; imageUrl: string; siteUrl: string }[] = [
    {
      title: 'Link to our Instagram profile',
      imageUrl: '/assets/img/site-footer/social/instagram.svg',
      siteUrl: 'https://www.instagram.com/coco.casing/',
    },
    {
      title: 'Link to our TikTok profile',
      imageUrl: '/assets/img/site-footer/social/tiktok.svg',
      siteUrl: 'https://www.tiktok.com/@cococasing',
    },
    {
      title: 'Link to our YouTube channel',
      imageUrl: '/assets/img/site-footer/social/youtube.svg',
      siteUrl: 'https://www.youtube.com/@cococasing',
    },
  ];

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
    src: `/assets/img/site-footer/payment/${option.id}.png`,
    alt: option.name,
  }));

  currentYear = new Date().getFullYear();

  constructor(private readonly navigationService: NavigationService) {}

  navigateToProducts() {
    this.navigationService.navigateToProducts();
  }
}
