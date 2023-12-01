import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { BlogPageComponent } from './blog-page/blog-page.component';
import { FaqPageComponent } from './faq-page/faq-page.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { BlogPostPageComponent } from './blog-page/blog-post-page/blog-post-page.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { getFullPageTitle } from './common/utils/page-helpers';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    pathMatch: 'full',
    title: getFullPageTitle('Home'),
  },
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
        component: ProductPageComponent,
        pathMatch: 'full',
      },
      {
        path: ':product/:variant',
        component: ProductPageComponent,
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
  { path: 'faq', component: FaqPageComponent, title: getFullPageTitle('FAQ') },
  {
    path: 'contact',
    component: ContactPageComponent,
    title: getFullPageTitle('Contact'),
  },
  {
    path: 'about',
    component: AboutPageComponent,
    title: getFullPageTitle('About'),
  },
  {
    path: 'not-found',
    component: NotFoundPageComponent,
    title: getFullPageTitle('404'),
  },
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
