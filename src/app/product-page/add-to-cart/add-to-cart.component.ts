import { TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { firstValueFrom, tap } from 'rxjs';
import { SerieCasePipe } from 'src/app/common/utils/seriecase.pipe';
import type { ProductVariant } from 'src/app/models/product.model';
import { defaultProductModel } from 'src/app/models/product.model';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
})
export class AddToCartComponent {
  private titleCasePipe = new TitleCasePipe();
  private serieCasePipe = new SerieCasePipe();

  @Input()
  productVariant?: ProductVariant;

  constructor(private shoppingCartService: ShoppingCartService) {}

  get variantTitle() {
    if (!this.productVariant) {
      return null;
    }

    const serieTitle = this.serieCasePipe.transform(
      this.titleCasePipe.transform(
        this.productVariant.serie.replaceAll('-', ' ')
      )
    );

    const modelTitle = this.titleCasePipe.transform(
      (this.productVariant.model === defaultProductModel
        ? ''
        : ` ${this.productVariant.model}`
      ).replaceAll('-', ' ')
    );

    const colorTitle = this.titleCasePipe.transform(
      (this.productVariant.color || '').replaceAll('-', ' ')
    );

    const tierTitle = this.titleCasePipe.transform(
      (this.productVariant.tier || '').replaceAll('-', ' ')
    );

    return `iPhone ${serieTitle}${modelTitle}${
      colorTitle || tierTitle ? ` ◦ ${colorTitle}${tierTitle}` : ''
    }`;
  }

  addToCart() {
    if (!this.productVariant) {
      return;
    }

    const addItemAndOpenCart$ = this.shoppingCartService
      .addLineItem(this.productVariant.id)
      .pipe(tap(() => this.shoppingCartService.openCart()));

    firstValueFrom(addItemAndOpenCart$);
  }
}
