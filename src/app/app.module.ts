/* eslint-disable */
import { NgModule } from '@angular/core';
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
  HammerModule,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { AccordionComponent } from './accordion/accordion.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { ImageSliderComponent } from './product-page/image-slider/image-slider.component';
import { CustomHammerConfig } from './custom-hammer-config';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HomePageComponent } from './home-page/home-page.component';
import { ProductSliderComponent } from './home-page/product-slider/product-slider.component';
import { PageFooterComponent } from './page-footer/page-footer.component';
import { InstaGalleryComponent } from './home-page/insta-gallery/insta-gallery.component';
import { PageNewsSignupComponent } from './page-news-signup/page-news-signup.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { BlogTeaserComponent } from './home-page/blog-teaser/blog-teaser.component';
import { BlogPageComponent } from './blog-page/blog-page.component';
import { FaqPageComponent } from './faq-page/faq-page.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { ProductCategoriesComponent } from './home-page/product-categories/product-categories.component';

const Client = require('shopify-buy');

export const client = Client.buildClient({
  domain: 'cococasing.myshopify.com',
  storefrontAccessToken: environment.storeFrontAT,
});

@NgModule({
  declarations: [
    AppComponent,
    ProductPageComponent,
    AccordionComponent,
    ImageSliderComponent,
    HomePageComponent,
    ProductSliderComponent,
    PageFooterComponent,
    InstaGalleryComponent,
    PageNewsSignupComponent,
    PageHeaderComponent,
    NotFoundPageComponent,
    AboutPageComponent,
    BlogTeaserComponent,
    BlogPageComponent,
    FaqPageComponent,
    ContactPageComponent,
    ProductCategoriesComponent,
  ],
  imports: [
    MatExpansionModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    BrowserModule,
    AppRoutingModule,
    HammerModule,
    HttpClientModule,
    NgxImageZoomModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: CustomHammerConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
