import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { BlogPageComponent } from './blog-page/blog-page.component';
import { FaqPageComponent } from './faq-page/faq-page.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { BlogPostPageComponent } from './blog-page/blog-post-page/blog-post-page.component';
import { ProductPageNewComponent } from './product-page-new/product-page-new.component';
import { ProductPageComponent } from './product-page/product-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  { path: 'old-products', component: ProductPageComponent },
  {
    path: 'products',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/#products',
      },
      {
        path: ':product',
        component: ProductPageNewComponent,
        pathMatch: 'full',
      },
      {
        path: ':product/:variant',
        component: ProductPageNewComponent,
      },
    ],
  },
  {
    path: 'blog',
    children: [
      {
        path: '',
        component: BlogPageComponent,
        pathMatch: 'full',
      },
      {
        path: ':category',
        component: BlogPageComponent,
        pathMatch: 'full',
      },
      {
        path: ':category/:slug',
        component: BlogPostPageComponent,
      },
    ],
  },
  { path: 'faq', component: FaqPageComponent },
  { path: 'contact', component: ContactPageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'not-found', component: NotFoundPageComponent },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
