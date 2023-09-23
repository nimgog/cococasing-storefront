import { Component } from '@angular/core';
import { Benefit } from './benefit';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss'],
})
export class AboutPageComponent {
  // TODO: Fill benefit "Learn More" URLs
  benefits: Benefit[] = [
    {
      title: 'Free & Easy Returns',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mus mauris vitae ultricies leo integer malesuada nunc vel.',
      imageUrl: '/assets/img/about-page/benefits/free-and-easy-returns.svg',
      learnMoreUrl: '/',
    },
    {
      title: 'Worldwide Shipping',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mus mauris vitae ultricies leo integer malesuada nunc vel.',
      imageUrl: '/assets/img/about-page/benefits/worldwide-shipping.svg',
      learnMoreUrl: '/',
    },
    {
      title: '60 Days Return',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mus mauris vitae ultricies leo integer malesuada nunc vel.',
      imageUrl: '/assets/img/about-page/benefits/60-days-return.svg',
      learnMoreUrl: '/',
    },
    {
      title: 'Quality Tested',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mus mauris vitae ultricies leo integer malesuada nunc vel.',
      imageUrl: '/assets/img/about-page/benefits/quality-tested.svg',
      learnMoreUrl: '/',
    },
  ];
}
