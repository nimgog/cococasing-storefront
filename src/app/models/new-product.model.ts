export type Image = {
  url: string;
  altText?: string;
};

export type Money = {
  amount: number;
  currencyCode: string;
};

export const productColors = [
  'desert-beige',
  'forest-green',
  'french-lavender',
  'jet-black',
  'midnight-blue',
  'sunset-orange',
];

export const defaultProductColor = 'sunset-orange';

export const productTiers = ['standard', 'premium'];

export const defaultProductTier = 'premium'; // TODO: Ask Nimer about this, standard/premium?

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
  price: Money;
};
