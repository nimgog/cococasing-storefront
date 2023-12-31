import type { OnDestroy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import type {
  BlogPostPreview,
  BlogPostCategory,
  BlogPostPreviewScullyRoute,
} from '../models/blog-post.model';
import { ActivatedRoute, Router } from '@angular/router';
import { type ScullyRoute, ScullyRoutesService } from '@scullyio/ng-lib';
import type { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { getFullPageTitle } from '../common/utils/page-helpers';

@Component({
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
})
export class BlogPageComponent implements OnInit, OnDestroy {
  private static readonly PageSize = 5;

  availablePostsSub?: Subscription;

  posts: BlogPostPreview[] = [];
  displayedPosts: BlogPostPreview[] = [];
  currentCategory?: BlogPostCategory;
  nextPage = 1;

  routeTabs: { title: string; category?: BlogPostCategory }[] = [
    { title: 'All Posts' },
    { title: 'Lifestyle', category: 'lifestyle' },
    { title: 'Training', category: 'training' },
    { title: 'Update', category: 'update' },
    { title: 'Environment', category: 'environment' },
  ];

  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private scully: ScullyRoutesService,
    private titleService: Title
  ) {}

  get categoryPageRoutePrefixes() {
    return this.routeTabs
      .filter((tab) => tab.category)
      .map((tab) => `/blog/${tab.category}/`);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.currentCategory =
        (params['category'] as BlogPostCategory) || undefined;
      this.setPageTitle();
      this.loadPosts();
    });
  }

  ngOnDestroy() {
    this.availablePostsSub?.unsubscribe();
  }

  changeCategory(category?: BlogPostCategory) {
    const url = category ? `/blog/${category}` : '/blog';
    const urlTree = this.router.createUrlTree([url]);

    this.location.go(urlTree.toString());
    this.currentCategory = category;
    this.setPageTitle();
    this.loadPosts();
  }

  loadPosts() {
    this.posts = [];
    this.displayedPosts = [];
    this.nextPage = 1;

    this.availablePostsSub?.unsubscribe();

    this.availablePostsSub = this.scully.available$.subscribe(
      (scullyRoutes) => {
        // TODO: Write Scully plugin to exclude unpublished posts
        let filteredRoutes: ScullyRoute[];

        if (this.currentCategory) {
          filteredRoutes = scullyRoutes.filter((route) =>
            route.route.startsWith(`/blog/${this.currentCategory}/`)
          );
        } else {
          filteredRoutes = scullyRoutes.filter((scullyRoute) =>
            this.categoryPageRoutePrefixes.some((prefix) =>
              scullyRoute.route.startsWith(prefix)
            )
          );
        }

        this.posts = (filteredRoutes as BlogPostPreviewScullyRoute[])
          .map((scullyRoute) => {
            const [category, slug] = scullyRoute.route
              .replace('/blog/', '')
              .split('/');

            return <BlogPostPreview>{
              title: scullyRoute.title,
              date: new Date(scullyRoute.date),
              thumbnailImageUrl: scullyRoute.thumbnailImageUrl,
              category,
              slug,
            };
          })
          .sort((postA, postB) => postB.date.getTime() - postA.date.getTime());

        this.loadMorePosts();
      }
    );
  }

  get hasMorePosts() {
    return this.displayedPosts.length < this.posts.length;
  }

  loadMorePosts() {
    if (!this.hasMorePosts) {
      return;
    }

    const startIndex = (this.nextPage - 1) * BlogPageComponent.PageSize;
    const endIndex = startIndex + BlogPageComponent.PageSize;

    this.displayedPosts = this.displayedPosts.concat(
      this.posts.slice(startIndex, endIndex)
    );

    this.nextPage++;
  }

  // TODO: This is just one possible positioning, is there any specific need?
  getColSpanForIndex(index: number) {
    if (
      index === 0 ||
      (index + 1 === this.posts.length && this.posts.length % 2 === 0)
    ) {
      return 6;
    }

    return [3, 3, 2, 4, 3, 3, 4, 2][--index % 8];
  }

  getTitleAllowedWidthForIndex(index: number) {
    const colSpan = this.getColSpanForIndex(index);

    switch (colSpan) {
      case 6:
        return 'sm:w-1/2';
      case 4:
        return 'sm:w-3/4';
      // case 3:
      //   return 'sm:w-11/12';
      default:
        return 'sm:w-auto';
    }
  }

  getCategoryColor(category: BlogPostCategory) {
    switch (category) {
      case 'lifestyle':
        return '#16A34A';
      case 'training':
        return '#0E73B9';
      case 'update':
        return '#F97316';
      case 'environment':
        return '#A3CB38';
    }
  }

  setPageTitle() {
    let pageTitle = 'Blog';
    const categoryTitle = this.routeTabs
      .filter((tab) => tab.category)
      .find((tab) => tab.category === this.currentCategory)?.title;

    if (categoryTitle) {
      pageTitle = `${categoryTitle} - ${pageTitle}`;
    }

    this.titleService.setTitle(getFullPageTitle(pageTitle));
  }
}
