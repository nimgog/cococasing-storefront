import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Image } from 'shopify-buy';
import { DeviceDetectorService } from 'src/app/services/device-detector.service';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss'],
})
export class ImageSliderComponent {
  @Input() selectedImages!: Image[];
  @Output() imageFullScreen = new EventEmitter();
  currentImageIndex = 0; // Default to first image
  isMobile = false
  constructor(private deviceDetectorService: DeviceDetectorService) {
    this.isMobile = deviceDetectorService.isMobile()
  }

  onPreviousClick() {
    this.currentImageIndex =
      (this.currentImageIndex + this.selectedImages.length - 1) %
      this.selectedImages.length;
  }

  onNextClick() {
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.selectedImages.length;
  }

  toggleFullScreen() {
    this.imageFullScreen.emit(this.currentImageIndex);
  }
}
