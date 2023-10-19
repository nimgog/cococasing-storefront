import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShopifyService } from '../services/shopify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, firstValueFrom, map, switchMap, tap } from 'rxjs';
import { LocationService } from '../services/location.service';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { colorTitleMap } from '../models/new-product.model';

@Component({
  selector: 'app-product-page-new',
  templateUrl: './product-page-new.component.html',
  styleUrls: ['./product-page-new.component.scss'],
})
export class ProductPageNewComponent implements OnInit, OnDestroy {
  isLoading = true;
  subscription?: Subscription;
  product!: any;
  selectedVariant!: any;
  availableSeries: string[] = [];
  availableModels: string[] = [];
  availableColors: string[] = [];

  constructor(
    private readonly location: Location,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly shopifyService: ShopifyService,
    private readonly shoppingCartService: ShoppingCartService,
    private readonly locationService: LocationService
  ) {}

  get selectedSerie(): string {
    return this.selectedVariant.serie;
  }

  get selectedModel(): string {
    return this.selectedVariant.model;
  }

  get selectedColor(): string | undefined {
    return this.selectedVariant.color;
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.params
      .pipe(
        tap(() => (this.isLoading = true)),
        switchMap((params) => {
          const productHandle = params['product'];
          const variantHandle = params['variant'];

          return this.shopifyService
            .fetchProduct(productHandle)
            .pipe(map((product) => ({ product, variantHandle })));
        })
      )
      .subscribe(({ product, variantHandle }) => {
        if (
          !product ||
          (variantHandle && !product.variantMap.get(variantHandle))
        ) {
          this.router.navigate(['/not-found'], { replaceUrl: true });
          return;
        }

        this.availableSeries = product.optionMap.get('series') || [];
        this.availableModels = product.optionMap.get('model') || [];
        this.availableColors = product.optionMap.get('color') || [];

        this.selectedVariant = product.variantMap.get(variantHandle);

        this.product = product;

        // TODO: Remove
        this.product.description = this.product.description.substring(0, 100);

        // TODO: Remove
        this.product.options = [...this.product.optionMap.entries()];

        // TODO: Remove
        this.product.variants = [...this.product.variantMap.entries()];

        if (!variantHandle) {
          this.changeVariant(
            '14',
            'regular',
            this.availableColors ? 'orange' : undefined,
            true
          );
          return;
        }

        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  changeVariant(
    newSerie: string,
    newModel: string,
    newColor?: string,
    redirect = false
  ) {
    const productHandle = this.activatedRoute.snapshot.params['product'];
    const variantHandle = this.buildVariantHandle(newSerie, newModel, newColor);

    const url = `/products/${productHandle}/${variantHandle}`;
    const urlTree = this.router.createUrlTree([url]);

    if (redirect) {
      this.router.navigateByUrl(urlTree, { replaceUrl: true });
    } else {
      this.location.go(urlTree.toString());
      this.selectedVariant = this.product.variantMap.get(variantHandle);
    }
  }

  changeSerie(newSerie: string) {
    const newModel = this.isValidModelForSerie(newSerie, this.selectedModel)
      ? this.selectedModel
      : 'regular';

    let newColor: string | undefined;

    if (this.product.optionMap.has('color')) {
      const currentColor = this.selectedColor!;

      newColor = this.isValidVariantEx(newSerie, newModel, currentColor)
        ? currentColor
        : 'orange';
    }

    this.changeVariant(newSerie, newModel, newColor);
  }

  changeModel(newModel: string) {
    const currentSerie = this.selectedSerie;

    if (!this.isValidModelForSerie(currentSerie, newModel)) {
      return;
    }

    let newColor: string | undefined;

    if (this.product.optionMap.has('color')) {
      newColor = this.isValidVariantEx(
        currentSerie,
        newModel,
        this.selectedColor!
      )
        ? this.selectedColor!
        : 'orange';
    }

    this.changeVariant(currentSerie, newModel, newColor);
  }

  changeColor(newColor: string) {
    if (!this.isValidVariant('color', newColor)) {
      return;
    }

    this.changeVariant(this.selectedSerie, this.selectedModel, newColor);
  }

  isValidModelForSerie(serie: string, model: string) {
    return [...this.product.variantMap.values()].some(
      (variant: any) => variant.serie === serie && variant.model === model
    );
  }

  isValidVariant(option: string, newValue: string) {
    const serie = option === 'serie' ? newValue : this.selectedSerie || '14';
    const model = option === 'model' ? newValue : this.selectedModel || '';
    const color = this.product.optionMap.has('color')
      ? option === 'color'
        ? newValue
        : this.selectedColor || 'orange'
      : undefined;

    return this.isValidVariantEx(serie, model, color);
  }

  isValidVariantEx(serie: string, model: string, color?: string) {
    const variantHandle = this.buildVariantHandle(serie, model, color);
    return this.product.variantMap.has(variantHandle);
  }

  buildVariantHandle(serie: string, model: string, color?: string) {
    let variantHandle = `iphone-${serie}`;

    if (model !== 'regular') {
      variantHandle += `-${model}`;
    }

    if (color) {
      // TODO: Extract this
      const fullColorNameLookup = new Map<string, string>([
        ['beige', 'desert-beige'],
        ['black', 'jet-black'],
        ['blue', 'midnight-blue'],
        ['green', 'forest-green'],
        ['lavender', 'french-lavender'],
        ['orange', 'sunset-orange'],
      ]);

      variantHandle += `-${fullColorNameLookup.get(color)}`;
    }

    return variantHandle;
  }

  // TODO: Extract
  getModelTitle(model: string) {
    return model
      .split('-')
      .map((word) => word[0].toUpperCase() + word.substring(1))
      .join(' ');
  }

  getColorTitle(color: string) {
    return colorTitleMap.get(color);
  }

  addToCart(variantId: string) {
    const addItemAndOpenCart$ = this.shoppingCartService
      .addLineItem(variantId, 1)
      .pipe(tap(() => this.shoppingCartService.openCart()));

    firstValueFrom(addItemAndOpenCart$);
  }
}
