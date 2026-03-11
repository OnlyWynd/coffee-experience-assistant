/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        coffee: {
          50:  '#fdf8f0',
          100: '#faefd8',
          200: '#f4ddb0',
          300: '#ebc47f',
          400: '#e0a54c',
          500: '#d4892b',
          600: '#c47020',
          700: '#a3561c',
          800: '#83451e',
          900: '#6b3a1c',
          950: '#3a1d0c',
        },
        espresso: '#2C1A0E',
        latte:    '#C8956C',
        cream:    '#F5E6D3',
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
