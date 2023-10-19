import { ComponentFixture, TestBed } from '@angular/core/testing';

import SiteShoppingCartComponent from './site-shopping-cart.component';

describe('SiteShoppingCartComponent', () => {
  let component: SiteShoppingCartComponent;
  let fixture: ComponentFixture<SiteShoppingCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SiteShoppingCartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteShoppingCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
