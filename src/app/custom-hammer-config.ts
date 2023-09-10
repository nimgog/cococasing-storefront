import { HammerGestureConfig } from '@angular/platform-browser';
import * as hammer from 'hammerjs';

export class CustomHammerConfig extends HammerGestureConfig {
  override overrides = <any>{
    // override hammerjs default configuration
    pinch: { enable: false },
    rotate: { enable: false },
    swipe: { treshold: 10 },
  };
  override buildHammer(element: HTMLElement) {
    return new hammer(element, this.overrides);
  }
}
