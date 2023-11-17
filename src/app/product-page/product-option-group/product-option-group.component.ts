import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-option-group',
  templateUrl: './product-option-group.component.html',
  styleUrls: ['./product-option-group.component.scss'],
})
export class ProductOptionGroupComponent {
  @Input()
  title!: string;
}
