/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-bg': '#f4f3ee',
        'brand-orange': '#c15f3c',
      },
    },
  },
  plugins: [],
};
