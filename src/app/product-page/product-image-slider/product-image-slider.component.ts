import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { isScullyRunning } from '@scullyio/ng-lib';
import { EMPTY, catchError, take } from 'rxjs';
import { Image, Product, ProductVariant } from 'src/app/models/product.model';
import { ImageLoaderService } from 'src/app/services/image-loader.service';
import { ScrollBlockerService } from 'src/app/services/scroll-blocker.service';

@Component({
  selector: 'app-product-image-slider',
  templateUrl: './product-image-slider.component.html',
  styleUrls: ['./product-image-slider.component.scss'],
})
export class ProductImageSliderComponent implements OnChanges, OnDestroy {
  selectedVariantImages: Image[] = [];
  highlightedImageIndex = 0;

  isFullscreen = false;
  fullscreenHighlightedImageIndex = 0;

  productHasChangedRecently = false;

  @Input()
  product?: Product;

  @Input()
  selectedVariant?: ProductVariant;

  constructor(
    private readonly imageLoaderService: ImageLoaderService,
    private readonly scrollBlockerService: ScrollBlockerService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    this.highlightedImageIndex = 0;
    this.fullscreenHighlightedImageIndex = 0;

    if (changes['product'] && this.product) {
      this.productHasChangedRecently = true;
    }

    if (changes['selectedVariant'] && this.selectedVariant) {
      const imageLoadingPriorityQueue = this.createImageLoadingPriorityGroups();
      this.loadImagesInPriority(imageLoadingPriorityQueue);
    }
  }

  ngOnDestroy() {
    if (this.isFullscreen) {
      this.exitFullscreen();
    }
  }

  showNextImage() {
    const nextImageIndex =
      ((this.isFullscreen
        ? this.fullscreenHighlightedImageIndex
        : this.highlightedImageIndex) +
        1) %
      this.selectedVariantImages.length;

    if (this.isFullscreen) {
      this.fullscreenHighlightedImageIndex = nextImageIndex;
    } else {
      this.highlightedImageIndex = nextImageIndex;
    }
  }

  showPreviousImage() {
    const previousImageIndex =
      ((this.isFullscreen
        ? this.fullscreenHighlightedImageIndex
        : this.highlightedImageIndex) -
        1 +
        this.selectedVariantImages.length) %
      this.selectedVariantImages.length;

    if (this.isFullscreen) {
      this.fullscreenHighlightedImageIndex = previousImageIndex;
    } else {
      this.highlightedImageIndex = previousImageIndex;
    }
  }

  enterFullscreen() {
    this.scrollBlockerService.blockPageScroll();
    this.fullscreenHighlightedImageIndex = this.highlightedImageIndex;
    this.isFullscreen = true;
  }

  exitFullscreen() {
    this.scrollBlockerService.unblockPageScroll();
    this.isFullscreen = false;
  }

  private createImageLoadingPriorityGroups() {
    const imageLoadingPriorityGroups: Image[][] = [];

    if (!this.selectedVariant) {
      return imageLoadingPriorityGroups;
    }

    const [selectedVariantMainImage, ...selectedVariantOtherImages] =
      this.selectedVariant.images;

    imageLoadingPriorityGroups.push(
      selectedVariantMainImage ? [selectedVariantMainImage] : []
    );

    imageLoadingPriorityGroups.push(selectedVariantOtherImages);

    if (!isScullyRunning() && this.productHasChangedRecently && this.product) {
      this.productHasChangedRecently = false;

      let otherVariantMainImageUrls = this.product.variants
        .filter((variant) => variant.images.length)
        .map((variant) => variant.images[0]);

      const distinctUrls = new Set(otherVariantMainImageUrls);

      otherVariantMainImageUrls = [...distinctUrls];

      imageLoadingPriorityGroups.push(otherVariantMainImageUrls);
    }

    return imageLoadingPriorityGroups;
  }

  private loadImagesInPriority(imageLoadingPriorityGroups: Image[][]) {
    if (!imageLoadingPriorityGroups.length) {
      return;
    }

    const [[selectedVariantMainImage], selectedVariantOtherImages] =
      imageLoadingPriorityGroups;

    this.imageLoaderService
      .loadImagesInPriorityOrder(
        imageLoadingPriorityGroups.map((group) =>
          group.map((image) => image.url)
        )
      )
      .pipe(
        take(1),
        catchError(() => EMPTY)
      )
      .subscribe(() => {
        this.selectedVariantImages = [
          selectedVariantMainImage,
          ...selectedVariantOtherImages,
        ];
      });
  }
}
