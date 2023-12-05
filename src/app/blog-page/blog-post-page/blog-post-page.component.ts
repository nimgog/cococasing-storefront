import { Component, type OnDestroy, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, type Subscription, catchError } from 'rxjs';
import { ScullyRoutesService } from '@scullyio/ng-lib';
import type {
  BlogPost,
  BlogPostScullyRoute,
} from '../../models/blog-post.model';
import { Title } from '@angular/platform-browser';
import { getFullPageTitle as getFullPageTitle } from 'src/app/common/utils/page-helpers';

@Component({
  selector: 'app-blog-post-page',
  templateUrl: './blog-post-page.component.html',
  styleUrls: ['./blog-post-page.component.scss'],
})
export class BlogPostPageComponent implements OnInit, OnDestroy {
  currentPostSub?: Subscription;

  blogPost?: BlogPost;

  constructor(
    private router: Router,
    private scully: ScullyRoutesService,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.currentPostSub = this.scully
      .getCurrent()
      .pipe(
        catchError(() => {
          return EMPTY;
        })
      )
      .subscribe((scullyRoute) => {
        const postScullyRoute = scullyRoute as BlogPostScullyRoute;
        const title = postScullyRoute.title;

        if (!postScullyRoute || !title) {
          this.router.navigate(['/not-found'], { replaceUrl: true });
          return;
        }

        this.titleService.setTitle(getFullPageTitle(title));

        this.blogPost = {
          title,
          author: postScullyRoute.author,
          date: new Date(postScullyRoute.date),
          headingImageUrl: postScullyRoute.headingImageUrl,
        };
      });
  }

  ngOnDestroy() {
    this.currentPostSub?.unsubscribe();
  }
}
