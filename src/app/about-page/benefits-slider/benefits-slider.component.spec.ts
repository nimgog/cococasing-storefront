import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitsSliderComponent } from './benefits-slider.component';

describe('BenefitsSliderComponent', () => {
  let component: BenefitsSliderComponent;
  let fixture: ComponentFixture<BenefitsSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BenefitsSliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BenefitsSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
