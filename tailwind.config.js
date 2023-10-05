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
        'coco-dark-blue': '#030712',
        'coco-dark-gray': '#374151',
        'coco-light-gray': '#F3F4F6',
        'coco-orange': '#F97316',
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
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
};
