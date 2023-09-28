import { BlogPostPreview } from '../blog-post-preview';

export interface BlogPost extends BlogPostPreview {
  author: string;
  contentUrl: string;
  headerImageUrl: string;
}
