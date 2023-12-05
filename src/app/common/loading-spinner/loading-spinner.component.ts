import type { AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent implements AfterViewInit, OnDestroy {
  @Input()
  color = 'black';

  @Input()
  bgClass = 'bg-inherit';

  @Input()
  scale = 1.0;

  @HostBinding('style.--spinner-color')
  get dynamicColor() {
    return this.color;
  }

  @ViewChild('container') container!: ElementRef;

  parentWasRelative = false;
  diameter = 0;

  constructor(
    private renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    const componentParent = this.container.nativeElement.parentNode.parentNode;
    const parentHeight = componentParent.offsetHeight * this.scale;

    if (componentParent.classList.contains('relative')) {
      this.parentWasRelative = true;
    } else {
      this.renderer.addClass(componentParent, 'relative');
    }

    this.diameter = parentHeight;
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    const componentParent = this.container.nativeElement.parentNode.parentNode;

    if (!this.parentWasRelative) {
      this.renderer.removeClass(componentParent, 'relative');
    }
  }
}
