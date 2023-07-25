import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectorService {

  isMobile(): boolean {
    const ua = navigator.userAgent;
    const screenSize = window.innerWidth;
    const touchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.maxTouchPoints > 0;

    // Regular expression to match mobile user agent strings
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

    // Check user agent string, screen size, and touch capabilities
    return mobileRegex.test(ua) || screenSize <= 480 || touchCapable;
  }
}
