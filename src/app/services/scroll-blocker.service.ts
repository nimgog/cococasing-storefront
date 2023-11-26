import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollBlockerService {
  private readonly renderer: Renderer2;

  private blockCount = 0;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  blockPageScroll() {
    if (this.blockCount === 0) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      this.renderer.setStyle(
        document.body,
        'padding-right',
        `${scrollbarWidth}px`
      );
      this.renderer.addClass(document.body, 'overflow-hidden');
    }

    this.blockCount++;
  }

  unblockPageScroll() {
    this.blockCount--;

    if (this.blockCount === 0) {
      this.renderer.removeClass(document.body, 'overflow-hidden');
      this.renderer.removeStyle(document.body, 'padding-right');
    }
  }
}
