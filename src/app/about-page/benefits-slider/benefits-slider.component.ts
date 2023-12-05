import { Component, Input } from '@angular/core';
import type { Benefit } from '../../models/benefit.model';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-benefits-slider',
  templateUrl: './benefits-slider.component.html',
  animations: [
    trigger('fadeAnimation', [
      state('shown', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('shown <=> hidden', [animate('400ms ease-in-out')]),
    ]),
    trigger('swapColorAnimation', [
      state('selected', style({ 'background-color': '#F97316' })),
      state('unselected', style({ 'background-color': '#D9D9D9' })),
      transition('selected <=> unselected', [animate('400ms ease-in-out')]),
    ]),
  ],
})
export class BenefitsSliderComponent {
  @Input()
  benefits: Benefit[] = [];

  currentBenefitIndex = 0;

  showPreviousBenefit() {
    if (this.currentBenefitIndex > 0) {
      this.currentBenefitIndex--;
    } else {
      this.currentBenefitIndex = this.benefits.length - 1;
    }
  }

  showNextBenefit() {
    if (this.currentBenefitIndex < this.benefits.length - 1) {
      this.currentBenefitIndex++;
    } else {
      this.currentBenefitIndex = 0;
    }
  }

  selectProduct(benefitIndex: number) {
    this.currentBenefitIndex = benefitIndex;
  }
}
