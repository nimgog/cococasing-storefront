import { Component } from '@angular/core';

@Component({
  selector: 'app-page-footer',
  templateUrl: './page-footer.component.html',
  styleUrls: ['./page-footer.component.scss'],
})
export class PageFooterComponent {
  leftColumnLinks: { title: string; url: string }[] = [
    { title: 'About Coco Casing&trade;', url: '/about' },
    { title: 'FAQ', url: '/faq' },
    { title: 'Privacy Policy', url: '/' }, // TODO: Add URL
    { title: 'Refund Policy', url: '/' }, // TODO: Add URL
    { title: 'Shipping Policy', url: '/' }, // TODO: Add URL
    { title: 'Terms of Service', url: '/' }, // TODO: Add URL
  ];

  rightColumnLinks: { title: string; url: string }[] = [
    { title: 'Home', url: '/' },
    { title: 'Products', url: '/products' },
    { title: 'Contact', url: '/contact' },
    { title: 'Blog', url: '/blog' },
  ];

  socialMediaLinks: { title: string; imageUrl: string; siteUrl: string }[] = [
    {
      title: 'Link to our Instagram profile',
      imageUrl: '/assets/img/page-footer/social/instagram.svg',
      siteUrl: 'https://www.instagram.com/coco.casing/',
    },
    {
      title: 'Link to our TikTok profile',
      imageUrl: '/assets/img/page-footer/social/tiktok.svg',
      siteUrl: 'https://www.tiktok.com/@cococasing',
    },
    {
      title: 'Link to our YouTube channel',
      imageUrl: '/assets/img/page-footer/social/youtube.svg',
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
    src: `/assets/img/page-footer/payment/${option.id}.png`,
    alt: option.name,
  }));

  currentYear = new Date().getFullYear();
}