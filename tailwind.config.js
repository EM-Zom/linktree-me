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
          red: '#DC2626',
          'red-dark': '#991B1B',
          'red-light': '#FEE2E2',
          orange: '#EA580C',
          'orange-dark': '#C2410C',
          'orange-light': '#FFEDD5',
          amber: '#F59E0B',
          'amber-light': '#FEF3C7',
        },
      },
    },
  },
  plugins: [],
}

