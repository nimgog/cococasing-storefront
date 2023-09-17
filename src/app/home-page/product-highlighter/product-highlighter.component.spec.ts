import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductHighlighterComponent } from './product-highlighter.component';

describe('ProductHighlighterComponent', () => {
  let component: ProductHighlighterComponent;
  let fixture: ComponentFixture<ProductHighlighterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductHighlighterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductHighlighterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
