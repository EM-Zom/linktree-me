/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        emergency: {
          red: '#EF4444',
          'red-dark': '#DC2626',
          'red-darker': '#B91C1C',
          'red-light': '#FEE2E2',
          'red-glow': '#FF4444',
          black: '#000000',
          'black-soft': '#0A0A0A',
          'black-dark': '#1A1A1A',
          'black-light': '#2A2A2A',
          'black-lighter': '#3A3A3A',
          'red-black': '#1A0000',
        },
      },
    },
  },
  plugins: [],
}

