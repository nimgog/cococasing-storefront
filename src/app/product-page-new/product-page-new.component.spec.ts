import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPageNewComponent } from './product-page-new.component';

describe('ProductPageNewComponent', () => {
  let component: ProductPageNewComponent;
  let fixture: ComponentFixture<ProductPageNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductPageNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductPageNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
