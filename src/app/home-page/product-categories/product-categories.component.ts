import { Component } from '@angular/core';
import type { ProductCategory } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-categories.component.html',
})
export class ProductCategoriesComponent {
  categories: ProductCategory[] = [
    {
      name: 'The Coco Package',
      description:
        'A phone case package that can keep up with your active life.',
      imageUrl: '/assets/img/home-page/product-categories/the-coco-package.jpg',
      pageUrl: '/products/the-coco-package',
    },
    {
      name: 'The Package',
      description: 'The package for casual activities for him and her.',
      imageUrl: '/assets/img/home-page/product-categories/the-package.png',
      pageUrl: '/products/the-package',
    },
    {
      name: 'The Glass Kit',
      description: 'Reinforce your outer structure with the glass kit.',
      imageUrl: '/assets/img/home-page/product-categories/the-glass-kit.png',
      pageUrl: '/products/the-glass-kit',
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
      pageUrl: '/products/the-screen-protection',
    },
    {
      name: 'Lenses',
      imageUrl: '/assets/img/home-page/product-categories/lenses.png',
      pageUrl: '/products/the-lens-protection',
    },
  ];
}
