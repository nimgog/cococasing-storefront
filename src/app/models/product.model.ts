import type { Image } from './image.model';

export type ProductCategory = {
  name: string;
  description?: string;
  imageUrl: string;
  pageUrl: string;
};

export type Money = {
  amount: number;
  currencyCode: string;
};

export const productSeries = [
  '8-se',
  'x',
  'xr',
  'xs',
  'xs-max',
  '11',
  '12',
  '13',
  '14',
];
export const productModels = ['mini', 'regular', 'plus', 'pro', 'pro-max'];
export const productColors = [
  'sunset-orange',
  'french-lavender',
  'desert-beige',
  'midnight-blue',
  'jet-black',
  'forest-green',
];
export const productTiers = ['standard', 'premium'];

export const defaultProductSerie = '14';
export const defaultProductModel = 'regular';
export const defaultProductColor = 'sunset-orange';
export const defaultProductTier = 'premium';

type ProductOption = 'color' | 'tier';

// Extend this when a new product is added
// Model is expected for each, so it shouldn't be added explicitly
export const expectedProductOptions = new Map<string, ProductOption[]>([
  ['the-coco-case', ['color']],
  ['the-coco-package', ['color']],
  ['the-glass-kit', []],
  ['the-lens-protection', ['tier']],
  ['the-package', ['color']],
  ['the-screen-protection', ['tier']],
]);

export type Product = {
  slug: string;
  description: string;
  variants: ProductVariant[];
};

export type ProductVariant = {
  id: string;
  slug: string;
  serie: string;
  model: string;
  color?: string;
  tier?: string;
  images: Image[];
  originalPrice?: Money;
  price: Money;
};

export const discountedProductTagPrefix = 'sale-';

export type FeaturedProduct = {
  productSlug: string;
  variantSlug: string;
  title: string;
  description: string;
  image: Image;
  price: Money;
  originalPrice?: Money;
  discountPercent?: number;
};
