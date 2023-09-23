import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitsHighlighterComponent } from './benefits-highlighter.component';

describe('BenefitsHighlighterComponent', () => {
  let component: BenefitsHighlighterComponent;
  let fixture: ComponentFixture<BenefitsHighlighterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BenefitsHighlighterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BenefitsHighlighterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
