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
        // GitHub-inspired dark palette
        'dark-bg': '#0D1117',       // canvas (page background)
        'dark-surface': '#161B22',  // subtle panels / header strip
        'dark-card': '#21262D',     // raised cards (most prominent elevation)
        'dark-border': '#30363D',
        // Body text
        'text-primary': '#1A1A2E',  // light-mode primary
        'text-secondary': '#4B5563',
        'text-dark': '#E6EDF3',     // GitHub fg.default
        'text-muted': '#6B7280',
        // Muted paired for dark mode
        muted: '#6B7280',
        'muted-dark': '#8B949E',    // GitHub fg.muted — visible on #0D1117
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
