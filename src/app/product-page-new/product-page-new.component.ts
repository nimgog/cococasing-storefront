/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShopifyProductService } from '../services/shopify-product.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Observable,
  Subscription,
  filter,
  firstValueFrom,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { ShoppingCartService } from '../services/shopping-cart.service';
import {
  Product,
  ProductVariant,
  defaultProductColor,
  defaultProductTier,
  expectedProductOptions,
} from '../models/new-product.model';

@Component({
  selector: 'app-product-page-new',
  templateUrl: './product-page-new.component.html',
  styleUrls: ['./product-page-new.component.scss'],
})
export class ProductPageNewComponent implements OnInit, OnDestroy {
  private productSub!: Subscription;
  private productPriceRefreshSignalSub!: Subscription;

  // TODO: Create a loading indicator
  isLoading = true;
  product?: Product;
  selectedVariant!: ProductVariant;

  availableSeries: string[] = [];
  availableModels: string[] = [];
  availableColors: string[] = [];
  availableTiers: string[] = [];

  constructor(
    private readonly location: Location,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly shopifyProductService: ShopifyProductService,
    private readonly shoppingCartService: ShoppingCartService
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

  get selectedTier(): string | undefined {
    return this.selectedVariant.tier;
  }

  ngOnInit() {
    this.productSub = this.activatedRoute.params
      .pipe(
        map((params) => ({
          productSlug: (params['product'] as string)?.toLocaleLowerCase(),
          variantSlug: (params['variant'] as string)?.toLocaleLowerCase(),
        })),
        tap(() => (this.isLoading = true)),
        tap(({ productSlug }) => {
          if (!productSlug || !expectedProductOptions.has(productSlug)) {
            this.router.navigate(['/not-found'], { replaceUrl: true });
            return;
          }
        }),
        // TODO: Fallback to default variant slug
        this.fetchProductAndSelectedVariantBySlug(),
        tap(({ variant }) => {
          // TODO: Set default variant instead
          if (!variant) {
            this.router.navigate(['/not-found'], { replaceUrl: true });
            return;
          }
        }),
        tap(() => (this.isLoading = false))
      )
      .subscribe(({ product, variant }) =>
        this.useProductAndSelectedVariant(product, variant!)
      );

    //     if (!variantHandle) {
    //       this.changeVariant(
    //         '14',
    //         'regular',
    //         this.availableColors ? 'orange' : undefined,
    //         true
    //       );
    //       return;
    //     }

    this.productPriceRefreshSignalSub =
      this.shopifyProductService.productPriceRefreshSignal$
        .pipe(
          filter(() => !!this.product),
          map(() => ({
            productSlug: this.product!.slug,
            variantSlug: this.selectedVariant.slug,
          })),
          this.fetchProductAndSelectedVariantBySlug()
        )
        .subscribe(({ product, variant }) =>
          this.useProductAndSelectedVariant(product, variant!)
        );
  }

  ngOnDestroy() {
    this.productSub.unsubscribe();
    this.productPriceRefreshSignalSub.unsubscribe();
  }

  fetchProductAndSelectedVariantBySlug(): (
    source: Observable<{ productSlug: string; variantSlug: string }>
  ) => Observable<{ product: Product; variant?: ProductVariant }> {
    return (source: Observable<{ productSlug: string; variantSlug: string }>) =>
      source.pipe(
        switchMap(({ productSlug, variantSlug }) => {
          return this.shopifyProductService
            .fetchProduct(productSlug)
            .pipe(map((product) => ({ product, variantSlug })));
        }),
        map(({ product, variantSlug }) => ({
          product,
          variant: product.variants.find(
            (variant) => variant.slug === variantSlug
          ),
        }))
      );
  }

  useProductAndSelectedVariant(product: Product, variant: ProductVariant) {
    this.product = product;
    this.selectedVariant = variant!;

    const availableSeries = new Set<string>();
    const availableModels = new Set<string>();
    const availableColors = new Set<string>();
    const availableTiers = new Set<string>();

    product.variants.forEach(({ serie, model, color, tier }) => {
      availableSeries.add(serie);
      availableModels.add(model);

      if (color) {
        availableColors.add(color);
      }

      if (tier) {
        availableTiers.add(tier);
      }
    });

    this.availableSeries = [...availableSeries];
    this.availableModels = [...availableModels];
    this.availableColors = [...availableColors];
    this.availableTiers = [...availableTiers];
  }

  changeVariant(
    newSerie: string,
    newModel: string,
    newColor?: string,
    newTier?: string,
    redirect = false
  ) {
    const newVariant = this.product!.variants.find(
      (variant) =>
        variant.serie === newSerie &&
        variant.model === newModel &&
        variant.color === newColor &&
        variant.tier === newTier
    )!;

    const url = `/products/${this.product!.slug}/${newVariant.slug}`;
    const urlTree = this.router.createUrlTree([url]);

    if (redirect) {
      this.router.navigateByUrl(urlTree, { replaceUrl: true });
    } else {
      this.location.go(urlTree.toString());
      this.selectedVariant = newVariant;
    }
  }

  changeSerie(newSerie: string) {
    const newModel = this.isValidModelForSerie(newSerie, this.selectedModel)
      ? this.selectedModel
      : 'regular';

    let newColor: string | undefined;

    if (this.selectedColor) {
      newColor = this.isValidVariantEx(
        newSerie,
        newModel,
        this.selectedColor,
        this.selectedTier
      )
        ? this.selectedColor
        : defaultProductColor;
    }

    let newTier: string | undefined;

    if (this.selectedTier) {
      newTier = this.isValidVariantEx(
        newSerie,
        newModel,
        newColor,
        this.selectedTier
      )
        ? this.selectedTier
        : defaultProductTier;
    }

    this.changeVariant(newSerie, newModel, newColor, newTier);
  }

  changeModel(newModel: string) {
    if (!this.isValidModelForSerie(this.selectedSerie, newModel)) {
      return;
    }

    let newColor: string | undefined;

    if (this.selectedColor) {
      newColor = this.isValidVariantEx(
        this.selectedSerie,
        newModel,
        this.selectedColor,
        this.selectedTier
      )
        ? this.selectedColor
        : defaultProductColor;
    }

    let newTier: string | undefined;

    if (this.selectedTier) {
      newTier = this.isValidVariantEx(
        this.selectedSerie,
        newModel,
        newColor,
        this.selectedTier
      )
        ? this.selectedTier
        : 'premium';
    }

    this.changeVariant(this.selectedSerie, newModel, newColor, newTier);
  }

  changeColor(newColor: string) {
    if (!this.isValidVariant('color', newColor)) {
      return;
    }

    this.changeVariant(
      this.selectedSerie,
      this.selectedModel,
      newColor,
      this.selectedTier
    );
  }

  changeTier(newTier: string) {
    if (!this.isValidVariant('tier', newTier)) {
      return;
    }

    this.changeVariant(
      this.selectedSerie,
      this.selectedModel,
      this.selectedColor,
      newTier
    );
  }

  isValidModelForSerie(serie: string, model: string) {
    return this.product!.variants.some(
      (variant) => variant.serie === serie && variant.model === model
    );
  }

  isValidVariant(option: string, newValue: string) {
    const serie = option === 'serie' ? newValue : this.selectedSerie;
    const model = option === 'model' ? newValue : this.selectedModel;
    const color = option === 'color' ? newValue : this.selectedColor;
    const tier = option === 'tier' ? newValue : this.selectedTier;

    return this.isValidVariantEx(serie, model, color, tier);
  }

  isValidVariantEx(
    serie: string,
    model: string,
    color?: string,
    tier?: string
  ) {
    return this.product!.variants.some(
      (variant) =>
        variant.serie === serie &&
        variant.model === model &&
        variant.color === color &&
        variant.tier === tier
    );
  }

  addToCart() {
    const addItemAndOpenCart$ = this.shoppingCartService
      .addLineItem(this.selectedVariant.id)
      .pipe(tap(() => this.shoppingCartService.openCart()));

    firstValueFrom(addItemAndOpenCart$);
  }
}
