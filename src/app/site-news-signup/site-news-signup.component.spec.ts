import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteNewsSignupComponent } from './site-news-signup.component';

describe('SiteNewsSignupComponent', () => {
  let component: SiteNewsSignupComponent;
  let fixture: ComponentFixture<SiteNewsSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SiteNewsSignupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteNewsSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
