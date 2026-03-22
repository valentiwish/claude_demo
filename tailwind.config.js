/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F8',
          100: '#FFE4EB',
          200: '#FFD6E0',
          300: '#FFB7C5',
          400: '#FB7299',
          500: '#F04868',
          600: '#D92D5A',
          700: '#B21E4B',
          800: '#8A153C',
          900: '#5D0F29',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
