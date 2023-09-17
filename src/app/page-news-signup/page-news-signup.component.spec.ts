import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNewsSignupComponent } from './page-news-signup.component';

describe('NewsSignupComponent', () => {
  let component: PageNewsSignupComponent;
  let fixture: ComponentFixture<PageNewsSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageNewsSignupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageNewsSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
