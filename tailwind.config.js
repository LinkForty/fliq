/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
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
    },
  },
  plugins: [],
}

