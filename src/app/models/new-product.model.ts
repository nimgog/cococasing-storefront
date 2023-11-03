export type Money = {
  amount: number;
  currencyCode: string;
};

export const colorSlugMap = new Map<string, string>([
  ['beige', 'desert-beige'],
  ['black', 'jet-black'],
  ['blue', 'midnight-blue'],
  ['green', 'forest-green'],
  ['lavender', 'french-lavender'],
  ['orange', 'sunset-orange'],
]);

export const colorTitleMap = new Map<string, string>([
  ['beige', 'Desert Beige'],
  ['black', 'Jet Black'],
  ['blue', 'Midnight Blue'],
  ['green', 'Forest Green'],
  ['lavender', 'French Lavender'],
  ['orange', 'Sunset Orange'],
]);
