/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'golden-moon': '#E5C07B', // Adjusted to a softer, more moon-like gold
      },
    },
  },
  plugins: [],
}
