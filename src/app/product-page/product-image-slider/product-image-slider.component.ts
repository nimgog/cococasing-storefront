import type { OnChanges, OnDestroy } from '@angular/core';
import { Component, Input } from '@angular/core';
import type { Product, ProductVariant } from 'src/app/models/product.model';
import { ScrollBlockerService } from 'src/app/services/scroll-blocker.service';
import type { Image } from 'src/app/models/image.model';

@Component({
  selector: 'app-product-image-slider',
  templateUrl: './product-image-slider.component.html',
})
export class ProductImageSliderComponent implements OnChanges, OnDestroy {
  selectedVariantImages: Image[] = [];
  highlightedImageIndex = 0;

  isFullscreen = false;
  selectedVariantFullscreenImages: Image[] = [];
  fullscreenHighlightedImageIndex = 0;

  @Input()
  product?: Product;

  @Input()
  selectedVariant?: ProductVariant;

  constructor(private scrollBlockerService: ScrollBlockerService) {}

  ngOnChanges() {
    this.highlightedImageIndex = 0;
    this.fullscreenHighlightedImageIndex = 0;

    if (this.selectedVariant) {
      this.selectedVariantImages = this.selectedVariant.images.map(
        (image, index) => ({
          src: `${image.src}&height=1000`,
          alt:
            image.alt ||
            (index === 0
              ? 'Main product image'
              : `Additional product image #${index}`),
        })
      );

      this.selectedVariantFullscreenImages = this.selectedVariant.images.map(
        (image, index) => ({
          src: `${image.src}`,
          alt:
            this.selectedVariantImages[index].alt ||
            (index === 0
              ? 'Main product image'
              : `Additional product image #${index}`),
        })
      );
    }
  }

  ngOnDestroy() {
    if (this.isFullscreen) {
      this.exitFullscreen();
    }
  }

  showNextImage() {
    if (!this.selectedVariant) {
      return;
    }

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
    if (!this.selectedVariant) {
      return;
    }

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
}
