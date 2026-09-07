/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
