import type { ScullyRoute } from '@scullyio/ng-lib';

export type BlogPostCategory =
  | 'lifestyle'
  | 'training'
  | 'update'
  | 'environment';

export type BlogPostPreview = {
  title: string;
  category: BlogPostCategory;
  date: Date;
  thumbnailImageUrl: string;
  slug: string;
};

export type BlogPost = {
  title: string;
  author: string;
  date: Date;
  headingImageUrl: string;
  timeToReadInMins: string;
};

export type BlogPostPreviewScullyRoute = ScullyRoute & {
  date: string;
  thumbnailImageUrl: string;
};

export type BlogPostScullyRoute = ScullyRoute & {
  author: string;
  date: string;
  headingImageUrl: string;
  readingTime: string;
};
