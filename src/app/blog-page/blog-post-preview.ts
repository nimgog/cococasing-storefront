import { PostCategory } from './blog-post-page/post-category';

export interface BlogPostPreview {
  title: string;
  category: PostCategory;
  date: Date;
  thumbnailImageUrl: string;
  slug: string;
}
