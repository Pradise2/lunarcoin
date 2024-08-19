/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkGray: '#282828',
        vividRed: '#F00F0B', 
        custom: 'linear-gradient(91.68deg, rgba(255, 215, 0, 0.4) -2.31%, rgba(187, 158, 2, 0.4) 38.68%, rgba(187, 158, 2, 0.4) 59.17%, rgba(255, 215, 0, 0.4) 100.15%)',
        golden :'#2B2B2B',
        'golden-moon': '#E5C07B',
      },
      backgroundImage: {
        'custom': 'linear-gradient(91.68deg, rgba(255, 215, 0, 0.4) -2.31%, rgba(187, 158, 2, 0.4) 38.68%, rgba(187, 158, 2, 0.4) 59.17%, rgba(255, 215, 0, 0.4) 100.15%)',
        'golden': '#2B2B2B',
      },
    },
  },
  plugins: [],
}
