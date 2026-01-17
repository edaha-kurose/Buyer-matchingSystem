/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A6FA5',
          50: '#F0F4FA',
          100: '#D9E4F4',
          200: '#B3C9E9',
          300: '#8DADDD',
          400: '#6792D2',
          500: '#4A6FA5',
          600: '#3B5984',
          700: '#2C4363',
          800: '#1D2C42',
          900: '#0E1621',
        },
        teal: {
          DEFAULT: '#4DB6AC',
          50: '#E0F2F1',
          100: '#B2DFDB',
          200: '#80CBC4',
          300: '#4DB6AC',
          400: '#26A69A',
          500: '#009688',
          600: '#00897B',
          700: '#00796B',
          800: '#00695C',
          900: '#004D40',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', '"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
