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
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { ImageSliderComponent } from './product-page/image-slider/image-slider.component';
import { CustomHammerConfig } from './custom-hammer-config';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HomePageComponent } from './home-page/home-page.component';
import { ProductSliderComponent } from './home-page/product-slider/product-slider.component';
import { SiteFooterComponent } from './site-footer/site-footer.component';
import { InstaGalleryComponent } from './home-page/insta-gallery/insta-gallery.component';
import { SiteNewsSignupComponent } from './site-news-signup/site-news-signup.component';
import { SiteHeaderComponent } from './site-header/site-header.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { BlogTeaserComponent } from './home-page/blog-teaser/blog-teaser.component';
import { BlogPageComponent } from './blog-page/blog-page.component';
import { FaqPageComponent } from './faq-page/faq-page.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { ProductCategoriesComponent } from './home-page/product-categories/product-categories.component';
import { ProductHighlighterComponent } from './home-page/product-highlighter/product-highlighter.component';
import { HeroSectionComponent } from './home-page/hero-section/hero-section.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { BenefitsSliderComponent } from './about-page/benefits-slider/benefits-slider.component';
import { BenefitsHighlighterComponent } from './about-page/benefits-highlighter/benefits-highlighter.component';
import { BlogPostPageComponent } from './blog-page/blog-post-page/blog-post-page.component';
import { ScullyLibModule } from '@scullyio/ng-lib';
import { GraphQLModule } from './graphql.module';
import { ProductPageNewComponent } from './product-page-new/product-page-new.component';
import { SiteShoppingCartComponent } from './site-shopping-cart/site-shopping-cart.component';
import { LineItemComponent } from './site-shopping-cart/line-item/line-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from './common/loading-spinner/loading-spinner.component';
import { ToastrModule } from 'ngx-toastr';
import { DropdownMenuComponent } from './common/dropdown-menu/dropdown-menu.component';
import { SiteDrawerComponent } from './site-drawer/site-drawer.component';

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
    SiteFooterComponent,
    InstaGalleryComponent,
    SiteNewsSignupComponent,
    SiteHeaderComponent,
    NotFoundPageComponent,
    AboutPageComponent,
    BlogTeaserComponent,
    BlogPageComponent,
    FaqPageComponent,
    ContactPageComponent,
    ProductCategoriesComponent,
    ProductHighlighterComponent,
    HeroSectionComponent,
    PageHeaderComponent,
    BenefitsSliderComponent,
    BenefitsHighlighterComponent,
    BlogPostPageComponent,
    ProductPageNewComponent,
    SiteShoppingCartComponent,
    LineItemComponent,
    LoadingSpinnerComponent,
    DropdownMenuComponent,
    SiteDrawerComponent,
  ],
  imports: [
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    BrowserModule,
    AppRoutingModule,
    HammerModule,
    HttpClientModule,
    NgxImageZoomModule,
    BrowserAnimationsModule,
    ScullyLibModule,
    GraphQLModule,
    ReactiveFormsModule,

    // TODO: Color of the notifications could be unified and aligned with the site design
    ToastrModule.forRoot({
      closeButton: true,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      progressBar: true,
      maxOpened: 3,
    }),
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: CustomHammerConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry) {
    matIconRegistry.setDefaultFontSetClass('material-icons-round');
  }
}
