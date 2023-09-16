/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    './src/app/home-page/**/*.{html,ts}',
    './src/app/product-slider/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        'coco-dark-blue': '#030712',
        'coco-light-gray': '#F3F4F6',
        'coco-orange': '#F97316',
      },
      fontFamily: {
        anekb: ['"Anek Bangla"', 'sans-serif'],
        anekt: ['"Anek Telugu"', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      maxWidth: {
        'centered-content': '1264px',
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    // ...
  ],
};
