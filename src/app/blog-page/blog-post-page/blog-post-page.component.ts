import { Component, OnInit } from '@angular/core';
import { BlogPost } from './blog-post';
import { blogPosts } from '../blog-posts';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, catchError, map, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-blog-post-page',
  templateUrl: './blog-post-page.component.html',
  styleUrls: ['./blog-post-page.component.scss'],
})
export class BlogPostPageComponent implements OnInit {
  blogPost?: BlogPost;

  content = '';

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        switchMap((params) => {
          const slug = params['slug'];

          if (!slug) {
            this.router.navigate(['/not-found']);
            return EMPTY;
          }

          const blogPost =
            slug && blogPosts.find((blogPost) => blogPost.slug === slug);

          if (!blogPost) {
            this.router.navigate(['/not-found']);
            return EMPTY;
          }

          return this.httpClient
            .get(`assets/blog/${slug}/content.md`, { responseType: 'text' })
            .pipe(map((content) => ({ content, blogPost })));
        }),
        catchError(() => {
          this.router.navigate(['/error']);
          return EMPTY;
        })
      )
      .subscribe((result) => {
        if (result) {
          this.content = result.content;
          this.blogPost = result.blogPost;
        }
      });
  }
}
