import daisyui from 'daisyui';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      fontFamily: {
        sans : ['Barlow', 'sans-serif'],
        barlow: ['Barlow', 'sans-serif'],
      },
      colors: {
        svelte: {
          primary: '#FF3E00',     // orange-red
          secondary: '#FF6B35',   // lighter orange
          accent: '#FFAB00',      // amber accent
          50: '#FFF5F0',          // very light warm background
          100: '#FFE4D6',         // light warm background
          200: '#FFCCB8',         // light orange
          300: '#FFB399',         // medium light orange
          400: '#FF9A7A',         // medium orange
          500: '#FF815C',         // orange
          600: '#FF6B35',         // secondary orange
          700: '#FF5722',         // darker orange
          800: '#E54A1A',         // dark orange
          900: '#CC3E00',         // very dark orange
        },
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#2D2D2D',         // modern dark gray
        }
      }
    }
  },

  plugins: [daisyui, typography],
};
