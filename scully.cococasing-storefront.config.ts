/* eslint-disable @typescript-eslint/no-explicit-any */
import { RouteConfig, ScullyConfig } from '@scullyio/scully';
import '@scullyio/scully-plugin-puppeteer';
import { blogPostRouterPlugin } from './scully/plugins/blog-post-router.plugin';
import { productRouterPlugin } from './scully/plugins/product-router.plugin';

const routes: RouteConfig = {
  '/products/:product': {
    type: productRouterPlugin,
  },
  '/products/:product/:variation': {
    type: productRouterPlugin,
  },
  '/blog/:category': {
    type: blogPostRouterPlugin,
    categories: ['lifestyle', 'training', 'update'],
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

// TODO: Reminder: look into other Scully plugins, too - there's up-front one for sitemaps
export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'cococasing-storefront',
  distFolder: './dist/cococasing-storefront', // output directory of your Angular build artifacts
  outDir: './dist/static', // directory for scully build artifacts
  defaultPostRenderers: [],
  routes,
  // handle404: 'not-found', // TODO: Look into how could the "not-found" page be used here
};
