import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-option-selector',
  templateUrl: './product-option-selector.component.html',
  styleUrls: ['./product-option-selector.component.scss'],
})
export class ProductOptionSelectorComponent {
  _buttonClass = '';

  @Input()
  isEnabled = true;

  @Input()
  isActive = false;

  @Input()
  set buttonClass(value: string | string[]) {
    this._buttonClass = Array.isArray(value) ? value.join(' ') : value;
  }
}
