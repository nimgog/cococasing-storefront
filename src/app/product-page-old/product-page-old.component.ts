import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { client } from '../app.module';
import { Image, Product, ProductVariant } from 'shopify-buy';
import { Option, colors, model, options } from '../models/product.model';
import { ImageSliderComponent } from './image-slider/image-slider.component';
import { LocationService } from '../services/location.service';
import { Subscription, catchError, from, of, switchMap } from 'rxjs';
import { DeviceDetectorService } from '../services/device-detector.service';

@Component({
  selector: 'app-product-page-old',
  templateUrl: './product-page-old.component.html',
  styleUrls: ['./product-page-old.component.scss'],
})
export class ProductPageOldComponent implements OnInit, OnDestroy {
  @ViewChild(ImageSliderComponent) imageSliderComponent!: ImageSliderComponent;

  title = 'cococasing';
  product!: Product;
  colors = colors;
  currency = '';
  model = model;
  options = options;
  serieOptions!: Option;
  modelOptions!: Option;
  colorOptions!: Option;
  selectedColor = 'Orange';
  selectedModel = '14';
  selectedSeries = 'Regular';
  selectedImages: Image[] = [];
  imageIndex = 0;
  isAtBottom = false;
  isMobile = false;
  variantId: string | null = null;
  tab = 'selection';
  showFullScreen = false;
  imageFullScreen!: Image;
  private checkoutId = '';
  private subscriptions: Subscription[] = [];
  loaded = false;

  constructor(
    private location: LocationService,
    private deviceDetectorService: DeviceDetectorService
  ) {}

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
    const checkoutCreationSubscription = this.location
      .getUserIP()
      .pipe(
        catchError(() => {
          return of({ ip: 'EUROPE' });
        }),
        switchMap((response: any) => {
          return this.location.getLocation(response.ip).pipe(
            catchError(() => {
              return of({ country_code: 'XX' });
            })
          );
        }),
        switchMap((response: any) => {
          if (response['country_code'] === 'SE') {
            this.currency = 'SEK';
          } else {
            this.currency = 'EUR';
          }
          return from(
            client.checkout.create({ presentmentCurrencyCode: this.currency })
          );
        })
      )
      .subscribe((checkout: any) => {
        this.checkoutId = checkout.id;

        this.getProduct();
      });

    this.subscriptions.push(checkoutCreationSubscription);
  }

  private getProduct(): void {
    client.product
      .fetch('gid://shopify/Product/8578309521732')
      .then((product: Product) => {
        this.product = product;
        this.setImages();
        this.setOptions();
        this.onOptionChange();
        this.loaded = true;
      })
      .catch((error: string) => {
        //
      });
  }

  private setOptions(): void {
    this.product.options.forEach((option: any) => {
      if (option.name === 'Series') this.serieOptions = option;
      else if (option.name === 'Model') this.modelOptions = option;
      else if (option.name === 'Color') this.colorOptions = option;
    });
  }

  private setImages(): void {
    this.selectedImages = this.product.images.filter((image) => {
      const altText = image.altText?.toLowerCase() ?? '';
      const isSelectedColor = altText.includes(
        this.selectedColor.toLowerCase()
      );
      const isScreenOrLens = altText === 'screen' || altText === 'lens';

      if (this.selectedModel.toLowerCase() !== '11') {
        return (
          (isSelectedColor || isScreenOrLens) && !altText.includes('iphone11')
        );
      }

      return (
        (isSelectedColor || isScreenOrLens) &&
        (altText.includes('iphone11') || isScreenOrLens)
      );
    });

    this.sortImages(this.selectedImages);
  }

  private sortImages(images: Image[]): void {
    images.sort((a, b) => {
      const aAltText = a.altText;
      const bAltText = b.altText;

      if (!aAltText || !bAltText) return 0;

      if (aAltText === 'screen' || aAltText === 'lens') return 1;
      if (bAltText === 'screen' || bAltText === 'lens') return -1;

      const aIndex = Number.parseInt(aAltText.split('_')[1], 10);
      const bIndex = Number.parseInt(bAltText.split('_')[1], 10);

      return aIndex - bIndex;
    });
  }

  setSelectedSeries(series: string): void {
    this.selectedSeries = series;
    this.onOptionChange();
  }

  setSelectedModel(model: string): void {
    this.selectedModel = model;
    this.setSelectedSeries('Regular');
    this.setSelectedColor('Orange');
    this.onOptionChange();
  }

  setSelectedColor(color: string): void {
    this.selectedColor = color;
    this.setImages();
    this.onOptionChange();
  }

  setTab(tab: string) {
    this.tab = tab;
  }

  setImageFullScreen(imageId: any) {
    this.imageFullScreen = this.selectedImages[imageId];
    this.showFullScreen = true;
  }

  closeFullScreen() {
    this.showFullScreen = false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const pos =
      (document.documentElement.scrollTop || document.body.scrollTop) +
      document.documentElement.offsetHeight;
    const max = document.documentElement.scrollHeight + 85;

    if (pos >= max) {
      this.isAtBottom = true;
    } else {
      this.isAtBottom = false;
    }
  }

  scrollToBottom() {
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
  }

  // In your product-page.component.ts
  onSwipeLeft() {
    this.imageSliderComponent.onNextClick();
  }

  onSwipeRight() {
    this.imageSliderComponent.onPreviousClick();
  }

  onOptionChange() {
    const selectedVariant = this.findSelectedVariant();
    this.variantId = selectedVariant
      ? (selectedVariant.id.split('/').pop() as string | null)
      : null;
  }

  private findSelectedVariant(): ProductVariant | undefined {
    return this.product.variants.find((variant) => {
      const variantOptions = variant.selectedOptions;

      const colorOption = variantOptions.find(
        (option) => option.name.toLowerCase() === 'color'
      );
      const modelOption = variantOptions.find(
        (option) => option.name.toLowerCase() === 'model'
      );
      const seriesOption = variantOptions.find(
        (option) => option.name.toLowerCase() === 'series'
      );

      return (
        colorOption?.value.toLowerCase() === this.selectedColor.toLowerCase() &&
        modelOption?.value.toLowerCase() ===
          this.selectedSeries.toLowerCase() &&
        seriesOption?.value.toLowerCase() === this.selectedModel.toLowerCase()
      );
    });
  }

  createCheckout(): void {
    const cId = this.checkoutId;
    const lineItemsToAdd = [
      {
        variantId: `gid://shopify/ProductVariant/${this.variantId}`,
        quantity: 1,
      },
    ];

    // Add an item to the checkout
    client.checkout.addLineItems(cId, lineItemsToAdd).then((checkout: any) => {
      window.location.href = checkout.webUrl;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
