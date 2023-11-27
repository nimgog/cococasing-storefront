import { Component } from '@angular/core';
import { Benefit } from './benefit';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
})
export class AboutPageComponent {
  benefits: Benefit[] = [
    {
      title: 'Free & Easy Returns',
      description:
        'Not delighted with your purchase? Return it for free, without any hassle.',
      imageUrl: '/assets/img/about-page/benefits/free-and-easy-returns.svg',
      learnMorePath: '/faq',
      learnMoreFragment: 'returns-and-refunds',
    },
    {
      title: 'We ship across Europe',
      description:
        "Wherever you are, we're just a click away. Enjoy our international shipping to 27 destinations.",
      imageUrl: '/assets/img/about-page/benefits/worldwide-shipping.svg',
      learnMorePath: '/faq',
      learnMoreFragment: 'order-and-delivery',
    },
    {
      title: '30 Days Return',
      description:
        'Shop with confidence knowing you have 30 days to return your purchase if it’s not a perfect fit.',
      imageUrl: '/assets/img/about-page/benefits/60-days-return.svg',
      learnMorePath: '/faq',
      learnMoreFragment: 'returns-and-refunds',
    },
    {
      title: 'Quality Tested',
      description:
        'Peace of mind comes with every purchase, thanks to our comprehensive quality testing procedures.',
      imageUrl: '/assets/img/about-page/benefits/quality-tested.svg',
      learnMorePath: '/blog/environment/quality-environment',
    },
  ];
}
