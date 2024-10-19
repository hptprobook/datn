/** @type {import('tailwindcss').Config} */
import rippleui from 'rippleui';

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
      input: {
        borderRadius: '6px',
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
      scale: {
        101: '1.01',
      },
      gridColumn: {
        'span-4.5': 'span 4.5 / span 4.5',
        'span-0.5': 'span 0.5 / span 0.5',
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
        slideDown: {
          '0%': { transform: 'translateY(-50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-50px)', opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: 1 },
          '100%': { transform: 'translateX(-100%)', opacity: 0 },
        },
        twinkle: {
          '0%': {
            transform: 'scale(0.95)',
            opacity: '0.7',
          },
          '50%': {
            transform: 'scale(1.05)',
            opacity: '0.9',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        twinkleRing: {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
      },
      animation: {
        slideIn: 'slideIn 0.3s ease-out forwards',
        slideOut: 'slideOut 0.3s ease-in forwards',
        slideDown: 'slideDown 0.3s ease-out forwards',
        slideUp: 'slideUp 0.3s ease-out forwards',
        twinkle: 'twinkle 0.3s ease-in-out',
        'twinkle-ring': 'twinkleRing 0.3s ease-out',
      },
    },
  },
  plugins: [
    rippleui,
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-clamp-1': {
          display: '-webkit-box',
          '-webkit-line-clamp': '1',
          '-webkit-box-orient': 'vertical',
          'text-overflow': 'ellipsis',
          overflow: 'hidden',
        },
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
    function ({ addUtilities }) {
      const newUtilities = {
        '.animate-twinkle-ring': {
          animation: 'twinkleRing 0.3s ease-out',
          borderRadius: '50%',
          boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.5)', // Tailwind red-600 with opacity
          position: 'absolute',
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
