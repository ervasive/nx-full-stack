/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    fontFamily: {
      base: ['var(--mc-font-family-base)'],
      mono: ['var(--mc-font-family-mono)'],
    },
    extend: {
      borderRadius: {
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
};
