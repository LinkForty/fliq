/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#39FF14',
        surface: {
          DEFAULT: '#050507',
          card: 'rgba(255, 255, 255, 0.07)',
        },
      },
    },
  },
  plugins: [],
}
