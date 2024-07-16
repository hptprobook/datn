/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      screens: {
        xs: '512px',
        sm: '640px',
        md: '768px',
        lg: '1025px',
        xl: '1280px',
        '2xl': '1536px',
      },
      maxWidth: {
        container: '1200px',
      },
      width: {
        search: '640px',
        fvw: '100vw',
        container: '1200px',
      },
      height: {
        fvh: '100vh',
        productImg: '300px',
        productItem: '450px',
        slider: '500px',
        banner: '450px',
        post: '540px',
      },
      text: {
        xxs: '10px',
      },
      padding: {
        min: '0.125rem',
        102: '28rem',
      },
      borderWidth: {
        df: '1px',
      },
      borderRadius: {
        xs: '4px',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: 1 },
          '100%': { transform: 'translateX(-100%)', opacity: 0 },
        },
      },
      animation: {
        slideIn: 'slideIn 0.3s ease-out forwards',
        slideOut: 'slideOut 0.3s ease-in forwards',
      },
    },
  },
  plugins: [
    daisyui,
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-clamp-2': {
          display: '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
        '.text-clamp-3': {
          display: '-webkit-box',
          '-webkit-line-clamp': '3',
          '-webkit-box-orient': 'vertical',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
