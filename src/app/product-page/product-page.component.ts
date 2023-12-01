/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Location, TitleCasePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ShopifyProductService } from '../services/shopify-product.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, filter, map, switchMap, tap } from 'rxjs';
import {
  Product,
  ProductVariant,
  defaultProductColor,
  defaultProductModel,
  defaultProductSerie,
  defaultProductTier,
  expectedProductOptions,
} from '../models/product.model';
import { NavigationService } from '../services/navigation.service';
import { getFullPageTitle } from '../common/utils/page-helpers';
import { Title } from '@angular/platform-browser';
import { SerieCasePipe } from '../common/utils/seriecase.pipe';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent implements OnInit, OnDestroy {
  private readonly titleCasePipe = new TitleCasePipe();
  private readonly serieCasePipe = new SerieCasePipe();

  private productSub!: Subscription;
  private productPriceRefreshSignalSub!: Subscription;

  // TODO: Create a loading indicator
  isLoading = true;
  product!: Product;
  selectedVariant!: ProductVariant;

  markerElementReached = false;

  @ViewChild('addToCartPlaceholder')
  addToCartPlaceholderElement!: ElementRef<HTMLDivElement>;

  @HostListener('document:scroll', ['$event'])
  onWindowScroll() {
    const placeholderNativeElement =
      this.addToCartPlaceholderElement.nativeElement;

    if (placeholderNativeElement) {
      const windowHeight = window.innerHeight;
      const markerBoundingRect =
        placeholderNativeElement.getBoundingClientRect();

      this.markerElementReached = markerBoundingRect.bottom <= windowHeight;
    }
  }

  constructor(
    private readonly location: Location,
    private readonly navigationService: NavigationService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly shopifyProductService: ShopifyProductService,
    private readonly titleService: Title
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
        tap(() => (this.isLoading = true)),
        map((params) => ({
          productSlug: (params['product'] as string)?.toLocaleLowerCase(),
          variantSlug: (params['variant'] as string)?.toLocaleLowerCase(),
        })),
        tap(({ productSlug }) => {
          if (!productSlug || !expectedProductOptions.has(productSlug)) {
            this.navigationService.navigateToProducts();
            return;
          }
        }),
        this.fetchProductAndVariantBySlug()
      )
      .subscribe(({ product, variant }) => {
        this.setProductAndSelectedVariant(product, variant);
        this.isLoading = false;
      });

    this.productPriceRefreshSignalSub =
      this.shopifyProductService.productPriceRefreshSignal$
        .pipe(
          filter(() => !this.isLoading),
          map(() => ({
            productSlug: this.product.slug,
            variantSlug: this.selectedVariant.slug,
          })),
          this.fetchProductAndVariantBySlug()
        )
        .subscribe(({ product, variant }) =>
          this.setProductAndSelectedVariant(product, variant)
        );
  }

  ngOnDestroy() {
    this.productSub.unsubscribe();
    this.productPriceRefreshSignalSub.unsubscribe();
  }

  fetchProductAndVariantBySlug(): (
    source: Observable<{ productSlug: string; variantSlug?: string }>
  ) => Observable<{ product: Product; variant?: ProductVariant }> {
    return (
      source: Observable<{ productSlug: string; variantSlug?: string }>
    ) =>
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

  setProductAndSelectedVariant(product: Product, variant?: ProductVariant) {
    this.product = product;

    if (variant) {
      this.selectedVariant = variant;
      this.setPageTitle();
    } else {
      this.selectDefaultVariant(product);
    }
  }

  selectDefaultVariant(product: Product) {
    const expectedOptions = expectedProductOptions.get(product.slug)!;

    const filterColor = expectedOptions.some((option) => option === 'color')
      ? defaultProductColor
      : undefined;

    const filterTier = expectedOptions.some((option) => option === 'tier')
      ? defaultProductTier
      : undefined;

    const defaultVariant =
      product.variants.find(
        (variant) =>
          variant.serie === defaultProductSerie &&
          variant.model === defaultProductModel &&
          variant.color === filterColor &&
          variant.tier === filterTier
      ) || product.variants[0]; // Fallback to the first variant should be impossible

    this.changeVariant(
      defaultVariant.serie,
      defaultVariant.model,
      defaultVariant.color,
      defaultVariant.tier,
      true
    );
  }

  changeVariant(
    newSerie: string,
    newModel: string,
    newColor?: string,
    newTier?: string,
    redirect = false
  ) {
    const newVariant = this.product.variants.find(
      (variant) =>
        variant.serie === newSerie &&
        variant.model === newModel &&
        variant.color === newColor &&
        variant.tier === newTier
    )!;

    const url = `/products/${this.product.slug}/${newVariant.slug}`;

    if (redirect) {
      this.location.replaceState(url);
    } else {
      this.location.go(url);
    }

    this.selectedVariant = newVariant;
    this.setPageTitle();
  }

  changeSerie(newSerie: string) {
    const newModel = this.isValidModelForSerie(newSerie, this.selectedModel)
      ? this.selectedModel
      : defaultProductModel;

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
    console.log('PARENT');

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
    if (this.isValidVariant('color', newColor)) {
      this.changeVariant(
        this.selectedSerie,
        this.selectedModel,
        newColor,
        this.selectedTier
      );
    }
  }

  changeTier(newTier: string) {
    if (this.isValidVariant('tier', newTier)) {
      this.changeVariant(
        this.selectedSerie,
        this.selectedModel,
        this.selectedColor,
        newTier
      );
    }
  }

  isValidModelForSerie(serie: string, model: string) {
    return this.product.variants.some(
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
    return this.product.variants.some(
      (variant) =>
        variant.serie === serie &&
        variant.model === model &&
        variant.color === color &&
        variant.tier === tier
    );
  }

  setPageTitle() {
    const productTitle = this.titleCasePipe.transform(
      this.product.slug.replaceAll('-', ' ')
    );

    const serieTitle = this.serieCasePipe.transform(
      this.titleCasePipe.transform(this.selectedSerie.replaceAll('-', ' '))
    );

    const modelTitle = this.titleCasePipe.transform(
      (this.selectedModel === defaultProductModel
        ? ''
        : ` ${this.selectedModel}`
      ).replaceAll('-', ' ')
    );

    let title = `${productTitle} - iPhone ${serieTitle}${modelTitle}`;

    if (this.selectedColor) {
      title += ` - ${this.titleCasePipe.transform(
        this.selectedColor.replaceAll('-', ' ')
      )}`;
    }

    if (this.selectedTier) {
      title += ` - ${this.titleCasePipe.transform(
        this.selectedTier.replaceAll('-', ' ')
      )}`;
    }

    this.titleService.setTitle(getFullPageTitle(title));
  }
}
