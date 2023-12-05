/* eslint-disable @typescript-eslint/no-explicit-any */
import type { HandledRoute } from '@scullyio/scully';
import { registerPlugin } from '@scullyio/scully';

export const blogPostRouterPlugin = 'blogPostRouterPlugin';

const blogPostRouter = (route: string, cfg: any): Promise<HandledRoute[]> =>
  cfg.categories.map((category: string) => ({
    route: route.replace(':category', category),
  }));

registerPlugin('router', blogPostRouterPlugin, blogPostRouter);
