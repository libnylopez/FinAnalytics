/** @type {import('tailwindcss').Config} */

// Los colores de la interfaz son tokens semánticos definidos como variables CSS
// en src/index.css (modo claro y oscuro). Aquí solo se exponen a Tailwind.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

const SYSTEM = ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'];

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
        // Identidad RAJIL
        rajil: {
          DEFAULT: token('rajil'),
          ink: token('rajil-ink'),
        },
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
        // Geist para la interfaz y los datos; Manrope para títulos y cifras protagonistas.
        sans: ['Geist', ...SYSTEM],
        display: ['Manrope', ...SYSTEM],
      },
      fontSize: {
        // Escala tipográfica de RAJIL (tamaño, interlineado, tracking)
        'title': ['30px', { lineHeight: '36px', letterSpacing: '-0.025em' }],      // título de pantalla
        'figure': ['32px', { lineHeight: '38px', letterSpacing: '-0.03em' }],      // cifra protagonista
        'figure-sm': ['22px', { lineHeight: '28px', letterSpacing: '-0.02em' }],   // cifra secundaria
        'headline': ['17px', { lineHeight: '24px', letterSpacing: '-0.012em' }],   // título de sección
        'body': ['15px', { lineHeight: '22px', letterSpacing: '-0.003em' }],       // texto y valores
        'callout': ['14px', { lineHeight: '20px', letterSpacing: '0' }],           // tablas, controles
        'footnote': ['13px', { lineHeight: '18px', letterSpacing: '0.002em' }],    // etiquetas, ayudas
        'caption': ['12px', { lineHeight: '16px', letterSpacing: '0.01em' }],      // ejes, cápsulas
      },
      borderRadius: {
        card: '16px',
        control: '10px',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        raised: 'var(--shadow-raised)',
        pop: 'var(--shadow-pop)',
        segment: 'var(--shadow-segment)',
        focus: '0 0 0 4px rgb(var(--accent) / 0.16)',
      },
      transitionTimingFunction: {
        // Curvas de movimiento: salida suave (entradas, hover) y énfasis (desplazamientos)
        out: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        emphasis: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      transitionDuration: {
        120: '120ms',
        180: '180ms',
        240: '240ms',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'sheet-in': {
          from: { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'sheet-out': {
          from: { opacity: '1', transform: 'translateY(0) scale(1)' },
          to: { opacity: '0', transform: 'translateY(4px) scale(0.985)' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 160ms cubic-bezier(0.2, 0.8, 0.2, 1)',
        'rise-in': 'rise-in 240ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards',
        'sheet-in': 'sheet-in 240ms cubic-bezier(0.32, 0.72, 0, 1)',
        'sheet-out': 'sheet-out 160ms cubic-bezier(0.4, 0, 1, 1) forwards',
        'fade-out': 'fade-out 160ms ease-in forwards',
      },
    },
  },
  plugins: [],
}
