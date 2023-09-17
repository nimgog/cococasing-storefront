import { Component } from '@angular/core';

interface FooterLink {
  title: string;
  url: string;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  leftColumnLinks: FooterLink[] = [
    { title: 'About Coco Casing&trade;', url: '/about' },
    { title: 'FAQ', url: '/faq' },
    { title: 'Privacy Policy', url: '/' }, // TODO: Add URL
    { title: 'Refund Policy', url: '/' }, // TODO: Add URL
    { title: 'Shipping Policy', url: '/' }, // TODO: Add URL
    { title: 'Terms of Service', url: '/' }, // TODO: Add URL
  ];

  rightColumnLinks: FooterLink[] = [
    { title: 'Home', url: '/' },
    { title: 'Products', url: '/products' },
    { title: 'Contact', url: '/contact' },
    { title: 'Blog', url: '/blog' },
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
    src: `/assets/img/home/payment/${option.id}.png`,
    alt: option.name,
  }));

  currentYear = new Date().getFullYear();
}
