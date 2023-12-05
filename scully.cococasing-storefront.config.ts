import { RouteConfig, ScullyConfig } from '@scullyio/scully';
import '@scullyio/scully-plugin-puppeteer';
import { blogPostRouterPlugin } from './scully/plugins/blog-post-router.plugin';
import { productRouterPlugin } from './scully/plugins/product-router.plugin';
import { MinifyHtml } from 'scully-plugin-minify-html';

const routes: RouteConfig = {
  '/products/:product': {
    type: productRouterPlugin,
  },
  '/products/:product/:variant': {
    type: productRouterPlugin,
  },
  '/blog/:category': {
    type: blogPostRouterPlugin,
    categories: ['lifestyle', 'training', 'update', 'environment'],
  },
  '/blog/:category/:slug': {
    type: 'contentFolder',
    category: {
      folder: './blog',
    },
    slug: {
      folder: (category: string) => `./blog/${category}`,
    },
  },
};

export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'cococasing-storefront',
  distFolder: './dist/cococasing-storefront', // output directory of your Angular build artifacts
  outDir: './dist/static', // directory for scully build artifacts
  defaultPostRenderers: [MinifyHtml],
  routes,
};
