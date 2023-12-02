import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-product-description',
  templateUrl: './product-description.component.html',
  styleUrls: ['./product-description.component.scss'],
})
export class ProductDescriptionComponent {
  isExpanded = false;
  descriptionHtml?: SafeHtml;

  @Input()
  set description(value: string) {
    this.descriptionHtml = this.domSanitizer.bypassSecurityTrustHtml(value);
  }

  constructor(private domSanitizer: DomSanitizer) {}
}
