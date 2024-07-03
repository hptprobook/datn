/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
      width: {
        search: '640px',
      },
      text: {
        xxs: '10px',
      },
    },
  },
  plugins: [],
};
