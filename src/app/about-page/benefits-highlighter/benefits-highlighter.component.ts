import { Component, Input } from '@angular/core';
import { Benefit } from '../benefit';

@Component({
  selector: 'app-benefits-highlighter',
  templateUrl: './benefits-highlighter.component.html',
})
export class BenefitsHighlighterComponent {
  @Input()
  benefits: Benefit[] = [];
}
