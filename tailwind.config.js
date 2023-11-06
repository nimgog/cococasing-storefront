/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    'src/app/**/*.{html,ts}',
    '!src/app/accordion/**/*.{html,ts}',
    '!src/app/product-page/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        'coco-case-desert-beige': '#D9CEAA',
        'coco-case-forest-green': '#415035',
        'coco-case-french-lavender': '#B38ED9',
        'coco-case-jet-black': '#000000',
        'coco-case-midnight-blue': '#33418D',
        'coco-case-sunset-orange': '#FEA92A',

        'coco-orange': '#F97316',
        'coco-red': '#DC2626',

        'coco-dark-blue': '#111827',
        'coco-darkest-blue': '#030712',

        'coco-light-gray': '#F3F4F6',
        'coco-light-medium-gray': '#D1D5DB',
        'coco-lighter-gray': '#E5E7EB',
        'coco-medium-gray': '#9CA3AF',
        'coco-off-white': '#F9FAFB',
        'coco-slate-gray': '#374151',
      },
      fontFamily: {
        anekb: ['"Anek Bangla"', 'sans-serif'],
        anekt: ['"Anek Telugu"', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      height: {
        'screen-minus-lg-header': 'calc(100vh - 76px)',
      },
      maxWidth: {
        'blog-content': '1040px',
        'centered-content': '1280px',
        'widened-content': '1440px',
      },
      zIndex: {
        'product-slider-arrow': '100',
        'dropdown-menu': '500',
        'mobile-drawer': '1000',
        'shopping-cart': '1000',
        'toast-container': '2000',
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
};
