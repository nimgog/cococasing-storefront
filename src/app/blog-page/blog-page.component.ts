import { Component, OnInit } from '@angular/core';
import { blogPosts } from './blog-posts';
import { PostCategory } from './post-category';
import { BlogPostPreview } from './blog-post-preview';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.scss'],
})
export class BlogPageComponent implements OnInit {
  private static readonly NumberOfPostsToLoad = 5;

  postPreviews: BlogPostPreview[] = [];
  currentCategory?: PostCategory;
  hasMorePosts = true;

  routeTabs = [
    { title: 'All Posts', route: '/blog' },
    { title: 'Lifestyle', route: '/blog/lifestyle' },
    { title: 'Training', route: '/blog/training' },
    { title: 'Update', route: '/blog/update' },
  ];

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.currentCategory = (params['category'] as PostCategory) || undefined;
      this.postPreviews = [];
      this.hasMorePosts = true;
      this.loadMorePosts();
    });
  }

  isActiveRoute(route: string) {
    return this.router.isActive(this.router.createUrlTree([route]), {
      paths: 'exact',
      queryParams: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  // TODO: This is just one possible positioning, is there any specific need?
  getColSpanForIndex(index: number) {
    if (
      index === 0 ||
      (index + 1 === this.postPreviews.length &&
        this.postPreviews.length % 2 === 0)
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
    }
  }

  loadMorePosts() {
    if (!this.hasMorePosts) {
      return;
    }

    let filteredPostPreviews = blogPosts;

    if (this.currentCategory) {
      filteredPostPreviews = filteredPostPreviews.filter(
        (postPreview) => postPreview.category === this.currentCategory
      );
    }

    this.postPreviews = filteredPostPreviews.slice(
      0,
      this.postPreviews.length + BlogPageComponent.NumberOfPostsToLoad
    );

    this.hasMorePosts = this.postPreviews.length < filteredPostPreviews.length;
  }
}
