export type Image = {
  src: string;
  alt?: string;
};

export type ResponsiveImage = Image & {
  srcset: string;
  sizes: string;
};

export type ImageBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export const imageBreakpointOrder: ImageBreakpoint[] = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
];

export const imageBreakpointMinSizes = new Map<ImageBreakpoint, number>([
  ['xs', 0],
  ['sm', 640],
  ['md', 768],
  ['lg', 1024],
  ['xl', 1280],
  ['2xl', 1536],
]);
