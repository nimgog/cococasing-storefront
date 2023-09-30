/* eslint-disable @typescript-eslint/no-explicit-any */
import { ScullyConfig, registerPlugin } from '@scullyio/scully';
import '@scullyio/scully-plugin-puppeteer';

const blogCategoryRouterPlugin = async (
  route?: string,
  cfg?: any
): Promise<{ route: string }[]> =>
  cfg.categories.map((category: string) => ({
    route: route?.replace(':category', category),
  }));

registerPlugin('router', 'blogCategoryRouterPlugin', blogCategoryRouterPlugin);

// TODO: Reminder: look into other Scully plugins, too - there's up-front one for sitemaps
export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'cococasing-storefront',
  distFolder: './dist/cococasing-storefront', // output directory of your Angular build artifacts
  outDir: './dist/static', // directory for scully build artifacts
  defaultPostRenderers: [],
  routes: {
    '/blog/:category': {
      type: 'blogCategoryRouterPlugin',
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
  },
};
