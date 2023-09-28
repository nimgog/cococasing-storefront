import { PostCategory } from './post-category';

export interface BlogPostPreview {
  title: string;
  category: PostCategory;
  publishedAt: Date;
  thumbnailImageUrl: string;
  slug: string;
}
