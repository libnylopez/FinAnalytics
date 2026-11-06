/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Color principal de la interfaz (azul marino)
        navy: {
          50: '#f2f5f9',
          100: '#e1e8f1',
          200: '#c3d1e2',
          600: '#2f5582',
          700: '#22436a',
          800: '#1a3554',
          900: '#122741',
        },
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#36a6f7',
          500: '#0c87eb',
          600: '#006ac9',
          700: '#0154a3',
          800: '#064786',
          900: '#0b3d6f',
          950: '#07264a',
        },
        uvg: {
          green: '#005f3e',
          gold: '#c99700',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
