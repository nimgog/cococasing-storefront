import { ViewportScroller } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(
    private readonly router: Router,
    private readonly viewportScroller: ViewportScroller
  ) {}

  navigateToProducts() {
    const urlTree = this.router.createUrlTree(['/'], { fragment: 'products' });

    if (
      this.router.isActive(urlTree, {
        paths: 'exact',
        fragment: 'exact',
        matrixParams: 'ignored',
        queryParams: 'ignored',
      })
    ) {
      this.viewportScroller.scrollToAnchor('products');
    } else {
      this.router.navigate(['/'], { fragment: 'products' });
    }
  }
}
