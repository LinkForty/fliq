import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e6f7f7',
          200: '#8ad4d5',
          400: '#3bbcbd',
          500: '#26adae',
          600: '#1e8a8b',
          950: '#0a2e2e',
        },
        navy: '#19192d',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
