import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { ProductVariant } from 'src/app/models/product.model';
import {
  productColors,
  productModels,
  productSeries,
  productTiers,
} from 'src/app/models/product.model';

@Component({
  selector: 'app-product-controls',
  templateUrl: './product-controls.component.html',
  styleUrls: ['./product-controls.component.scss'],
})
export class ProductControlsComponent {
  availableSeries: string[] = [];
  availableModels: string[] = [];
  availableColors: string[] = [];
  availableTiers: string[] = [];

  @Input()
  set availableVariants(productVariants: ProductVariant[]) {
    this.setAvailableOptions(productVariants);
  }

  @Input()
  selectedVariant?: ProductVariant;

  @Input()
  isValidVariant!: (option: string, newValue: string) => boolean;

  @Output()
  serieChange: EventEmitter<string> = new EventEmitter();

  @Output()
  modelChange: EventEmitter<string> = new EventEmitter();

  @Output()
  colorChange: EventEmitter<string> = new EventEmitter();

  @Output()
  tierChange: EventEmitter<string> = new EventEmitter();

  setAvailableOptions(productVariants: ProductVariant[]) {
    const availableSeries = new Set<string>();
    const availableModels = new Set<string>();
    const availableColors = new Set<string>();
    const availableTiers = new Set<string>();

    productVariants.forEach(({ serie, model, color, tier }) => {
      availableSeries.add(serie);
      availableModels.add(model);

      if (color) {
        availableColors.add(color);
      }

      if (tier) {
        availableTiers.add(tier);
      }
    });

    // Below code is there to sort the options
    this.availableSeries = productSeries.filter((serie) =>
      availableSeries.has(serie)
    );

    this.availableModels = productModels.filter((model) =>
      availableModels.has(model)
    );

    this.availableColors = productColors.filter((color) =>
      availableColors.has(color)
    );

    this.availableTiers = productTiers.filter((tier) =>
      availableTiers.has(tier)
    );
  }
}
