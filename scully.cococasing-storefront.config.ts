import { RouteConfig, ScullyConfig, setPluginConfig } from '@scullyio/scully';
import '@scullyio/scully-plugin-puppeteer';
import { blogPostRouterPlugin } from './scully/plugins/blog-post-router.plugin';
import { productRouterPlugin } from './scully/plugins/product-router.plugin';
import { MinifyHtml } from 'scully-plugin-minify-html';
import { getFlashPreventionPlugin } from '@scullyio/scully-plugin-flash-prevention';
import {
  timeToRead,
  timeToReadOptions as TimeToReadOptions,
} from 'scully-plugin-time-to-read';

const SeoHrefOptimise = 'seoHrefOptimise';
const FlashPrevention = getFlashPreventionPlugin();

setPluginConfig(timeToRead, {
  path: '/blog/',
} as TimeToReadOptions);

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
  defaultPostRenderers: [SeoHrefOptimise, FlashPrevention, MinifyHtml],
  routes,
  thumbnails: true,
};
