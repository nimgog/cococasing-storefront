/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/directive-selector */
import { NgIf } from '@angular/common';
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { isScullyRunning } from '@scullyio/ng-lib';

@Directive({
  selector: '[scullyExclude]',
})
export class ScullyExcludeDirective extends NgIf<boolean> {
  constructor(viewContainer: ViewContainerRef, templateRef: TemplateRef<any>) {
    super(viewContainer, templateRef);
    this.ngIf = !isScullyRunning();
  }

  @Input()
  set scullyExclude(condition: any) {
    this.ngIf = !isScullyRunning() && condition;
  }
}
