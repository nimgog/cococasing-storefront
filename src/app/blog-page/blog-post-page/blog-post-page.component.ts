import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Subscription, catchError } from 'rxjs';
import { ScullyRoute, ScullyRoutesService } from '@scullyio/ng-lib';
import { BlogPost } from './blog-post';

interface BlogPostScullyRoute extends ScullyRoute {
  author: string;
  date: string;
  headingImageUrl: string;
}

@Component({
  selector: 'app-blog-post-page',
  templateUrl: './blog-post-page.component.html',
  styleUrls: ['./blog-post-page.component.scss'],
})
export class BlogPostPageComponent implements OnInit, OnDestroy {
  currentPostSub?: Subscription;

  blogPost?: BlogPost;

  constructor(
    private readonly router: Router,
    private readonly scully: ScullyRoutesService
  ) {}

  ngOnInit() {
    this.currentPostSub = this.scully
      .getCurrent()
      .pipe(
        catchError((error) => {
          // TODO: handle errors - navigate to show modal
          console.log(error);
          return EMPTY;
        })
      )
      .subscribe((scullyRoute) => {
        const postScullyRoute = scullyRoute as BlogPostScullyRoute;

        if (!postScullyRoute) {
          this.router.navigate(['/not-found'], { replaceUrl: true });
          return;
        }

        this.blogPost = {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          title: postScullyRoute.title!,
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
