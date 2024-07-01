/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    screens: {
      'sm': { 'min': '375px', 'max': '767px' },
    },
    extend: {},
  },
  plugins: [],
}

