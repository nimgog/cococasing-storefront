import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PostCategory } from './blog-post-page/post-category';
import { ActivatedRoute, Router } from '@angular/router';
import { ScullyRoute, ScullyRoutesService } from '@scullyio/ng-lib';
import { Subscription } from 'rxjs';
import { BlogPostPreview } from './blog-post-preview';

interface BlogPostPreviewScullyRoute extends ScullyRoute {
  date: string;
  thumbnailImageUrl: string;
}

@Component({
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
})
export class BlogPageComponent implements OnInit, OnDestroy {
  private static readonly PageSize = 5;

  availablePostsSub?: Subscription;

  posts: BlogPostPreview[] = [];
  displayedPosts: BlogPostPreview[] = [];
  currentCategory?: PostCategory;
  nextPage = 1;

  routeTabs: { title: string; category?: PostCategory }[] = [
    { title: 'All Posts' },
    { title: 'Lifestyle', category: 'lifestyle' },
    { title: 'Training', category: 'training' },
    { title: 'Update', category: 'update' },
    { title: 'Environment', category: 'environment' },
  ];

  constructor(
    private readonly location: Location,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly scully: ScullyRoutesService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.currentCategory = (params['category'] as PostCategory) || undefined;
      this.loadPosts();
    });
  }

  ngOnDestroy() {
    this.availablePostsSub?.unsubscribe();
  }

  changeCategory(category?: PostCategory) {
    const url = category ? `/blog/${category}` : '/blog';
    const urlTree = this.router.createUrlTree([url]);

    this.location.go(urlTree.toString());
    this.currentCategory = category;
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
          filteredRoutes = scullyRoutes.filter(
            (scullyRoute) =>
              scullyRoute.route.startsWith('/blog/lifestyle/') ||
              scullyRoute.route.startsWith('/blog/training/') ||
              scullyRoute.route.startsWith('/blog/update/')
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
        return 'w-1/2';
      case 4:
        return 'w-3/4';
      // case 3:
      //   return 'w-11/12';
      default:
        return 'w-auto';
    }
  }

  getCategoryColor(category: PostCategory) {
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
}
