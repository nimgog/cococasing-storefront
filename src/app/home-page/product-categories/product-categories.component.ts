import { Component } from '@angular/core';

interface ProductCategory {
  name: string;
  description?: string;
  imageUrl: string;
  pageUrl: string;
}

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-categories.component.html',
  styleUrls: ['./product-categories.component.scss'],
})
export class ProductCategoriesComponent {
  categories: ProductCategory[] = [
    {
      name: 'The Coco Package',
      description:
        'A phone case package that can keep up with your active life.',
      imageUrl: '/assets/img/home-page/product-categories/coco-package.jpg',
      pageUrl: '/', // TODO: Add link
    },
    {
      name: 'The Package',
      description: 'The package for casual activities for him and her.',
      imageUrl: '/assets/img/home-page/product-categories/package.png',
      pageUrl: '/products/the-package',
    },
    {
      name: 'The Glass Kit',
      description: 'Reinforce your outer structure with the glass kit.',
      imageUrl: '/assets/img/home-page/product-categories/glass-kit.png',
      pageUrl: '/', // TODO: Add link
    },
    {
      name: 'Cases',
      imageUrl: '/assets/img/home-page/product-categories/cases.png',
      pageUrl: '/products/the-coco-case',
    },
    {
      name: 'Screen Protectors',
      imageUrl:
        '/assets/img/home-page/product-categories/screen-protectors.png',
      pageUrl: '/', // TODO: Add link
    },
    {
      name: 'Lenses',
      imageUrl: '/assets/img/home-page/product-categories/lenses.png',
      pageUrl: '/', // TODO: Add link
    },
  ];
}
