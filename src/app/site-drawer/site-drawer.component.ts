import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-site-drawer',
  templateUrl: './site-drawer.component.html',
})
export class SiteDrawerComponent {
  @Output()
  drawerClose: EventEmitter<void> = new EventEmitter();

  isProductsMenuOpen = false;

  closeDrawer() {
    this.drawerClose.emit();
  }

  toggleProductsMenu() {
    this.isProductsMenuOpen = !this.isProductsMenuOpen;
  }
}
