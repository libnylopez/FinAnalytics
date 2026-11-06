/** @type {import('tailwindcss').Config} */

// Los colores de la interfaz son tokens semánticos definidos como variables CSS
// en src/index.css (modo claro y oscuro). Aquí solo se exponen a Tailwind.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: token('canvas'),
        sidebar: token('sidebar'),
        surface: {
          DEFAULT: token('surface'),
          2: token('surface-2'),
        },
        field: token('field'),
        segment: token('segment'),
        line: {
          DEFAULT: token('line'),
          strong: token('line-strong'),
        },
        ink: {
          DEFAULT: token('ink'),
          2: token('ink-2'),
          3: token('ink-3'),
        },
        accent: token('accent'),
        primary: token('primary'),
        positive: token('positive'),
        negative: token('negative'),
        warning: token('warning'),
        chart: {
          1: token('chart-1'),
          2: token('chart-2'),
        },
        // Paleta heredada; solo la usa ScrumBacklogView (no se muestra en la app).
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
      },
      fontFamily: {
        // Fuentes del sistema: SF Pro en Apple, Segoe UI en Windows, Roboto en Android.
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        card: '14px',
        control: '8px',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        pop: 'var(--shadow-pop)',
        segment: 'var(--shadow-segment)',
      },
      transitionTimingFunction: {
        // Curva de salida suave, similar a la de los controles de macOS
        out: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'sheet-in': {
          from: { opacity: '0', transform: 'translateY(6px) scale(0.985)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 180ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        'sheet-in': 'sheet-in 220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
