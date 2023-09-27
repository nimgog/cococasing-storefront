import { PostCategory } from './post-category';

export interface BlogPostPreview {
  title: string;
  category: PostCategory;
  publishedAt: Date;
  thumbnailUrl: string;
  slug: string;
}
