/* eslint-disable @angular-eslint/directive-selector */
import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
} from '@angular/core';
import {
  ImageBreakpoint,
  imageBreakpointMinSizes,
  imageBreakpointOrder,
} from 'src/app/models/image';

@Directive({
  selector: '[assetImage]',
})
export class AssetImageDirective implements OnChanges {
  @Input('assetImage')
  source?: string;

  @Input()
  breakpoints: ImageBreakpoint[] = [];

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    if (this.el.nativeElement && this.source && this.breakpoints?.length) {
      this.breakpoints.sort(
        (a, b) =>
          imageBreakpointOrder.indexOf(a) - imageBreakpointOrder.indexOf(b)
      );

      this.setImageAttributes(
        this.el.nativeElement,
        this.source,
        this.breakpoints
      );
    }
  }

  private setImageAttributes(
    imgEl: HTMLImageElement,
    source: string,
    breakpoints: ImageBreakpoint[]
  ) {
    const srcset = breakpoints
      .map((breakpoint, index) => {
        const imagePathSegments = source.split('.');
        imagePathSegments.splice(-1, 0, breakpoint);
        const breakpointImagePath = imagePathSegments.join('.');

        const nextBreakpoint = breakpoints[index + 1];

        if (!nextBreakpoint) {
          return source;
        }

        const nextBreakpointMinWidth =
          imageBreakpointMinSizes.get(nextBreakpoint);

        if (!nextBreakpointMinWidth) {
          return source;
        }

        return `${breakpointImagePath} ${nextBreakpointMinWidth - 1}w`;
      })
      .join(', ');

    const sizes = breakpoints
      .map((_breakpoint, index) => {
        const nextBreakpoint = breakpoints[index + 1];

        if (!nextBreakpoint) {
          return '100vw';
        }

        const nextBreakpointMinWidth =
          imageBreakpointMinSizes.get(nextBreakpoint);

        if (!nextBreakpointMinWidth) {
          return '100vw';
        }

        return `(max-width: ${nextBreakpointMinWidth - 1}px) 100vw`;
      })
      .join(', ');

    this.renderer.setAttribute(imgEl, 'src', source);
    this.renderer.setAttribute(imgEl, 'srcset', srcset);
    this.renderer.setAttribute(imgEl, 'sizes', sizes);
  }
}
