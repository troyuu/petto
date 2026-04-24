const nativewindPreset = require('nativewind/preset');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}', './App.tsx'],
  presets: [nativewindPreset],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EAFAF1',
          100: '#D5F5E3',
          200: '#ABEBC6',
          300: '#82D9A2',
          400: '#52B788',
          500: '#2D6A4F',
          600: '#245A42',
          700: '#1B4332',
          800: '#133026',
          900: '#0B1F19',
        },
        accent: {
          50: '#FEF3EE',
          100: '#FCE0D3',
          200: '#F9C1A7',
          300: '#F4A261',
          400: '#F08C47',
          500: '#E76F51',
          600: '#D35E43',
          700: '#B84E38',
          800: '#9A3E2D',
          900: '#7D3024',
        },
        cream: '#FDF6EC',
        'dark-bg': '#1A1A2E',
        'dark-surface': '#16213E',
        'dark-card': '#1E2A47',
        'text-primary': '#1A1A2E',
        'text-secondary': '#6B7280',
        'text-dark': '#E8E8E8',
        'text-muted': '#9CA3AF',
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
