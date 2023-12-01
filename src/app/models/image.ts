export type Image = {
  src: string;
  alt?: string;
};

export type ResponsiveImage = Image & {
  srcset: string;
  sizes: string;
};
