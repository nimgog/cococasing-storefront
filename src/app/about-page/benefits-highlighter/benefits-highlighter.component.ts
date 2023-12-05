import { Component, Input } from '@angular/core';
import type { Benefit } from '../../models/benefit.model';

@Component({
  selector: 'app-benefits-highlighter',
  templateUrl: './benefits-highlighter.component.html',
})
export class BenefitsHighlighterComponent {
  @Input()
  benefits: Benefit[] = [];
}
