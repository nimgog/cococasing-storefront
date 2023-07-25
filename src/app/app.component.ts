import { Component } from '@angular/core';
import { DeviceDetectorService } from './services/device-detector.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cococasing';
  isMobile = false;

  constructor(private deviceDetector: DeviceDetectorService) {
    this.isMobile = this.deviceDetector.isMobile()
  }
}
