/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        roziq: {
          primary: '#047857',
          deep: '#064E3B',
          mint: '#D1FAE5',
          canvas: '#F4F7F5',
          surface: '#FFFFFF',
          line: '#E3ECE7',
          ink: '#0B1F17',
          muted: '#55695F',
          excluded: '#B42318',
          'zakat-tint': '#FEF3C7',
          'zakat-ink': '#92400E',
          'loss-tint': '#FEE4E2',
        },
        halal: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        rz: {
          black: 'var(--rz-black)',
          gold: 'var(--rz-gold)',
          'gold-light': 'var(--rz-gold-light)',
          'gold-dark': 'var(--rz-gold-dark)',
          emerald: 'var(--rz-emerald)',
          'emerald-light': 'var(--rz-emerald-light)',
          'emerald-glow': 'var(--rz-emerald-glow)',
          ruby: 'var(--rz-ruby)',
          pearl: 'var(--rz-pearl)',
          bronze: 'var(--rz-bronze)',
          onyx: 'var(--rz-onyx)',
          charcoal: 'var(--rz-charcoal)',
          slate: 'var(--rz-slate)',
        }
      },
      fontFamily: {
        nastaliq: ['"Noto Nastaliq Urdu"', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
