/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkGray: '#282828',
        CharcoalGray: '#424242',
        vividRed: '#F00F0B', 
        custom: 'linear-gradient(91.68deg, rgba(255, 215, 0, 0.4) -2.31%, rgba(187, 158, 2, 0.4) 38.68%, rgba(187, 158, 2, 0.4) 59.17%, rgba(255, 215, 0, 0.4) 100.15%)',
        golden :'#2B2B2B',
        'golden-moon': '#E5C07B',
        sinc: '#E6E6E6',
        fin:'#D1D1D1',
        hy: '#3F3F3F',
        'task' : '#BB9E02'
      },
      backgroundImage: {
        'custom': 'linear-gradient(91.68deg, rgba(255, 215, 0, 0.4) -2.31%, rgba(187, 158, 2, 0.4) 38.68%, rgba(187, 158, 2, 0.4) 59.17%, rgba(255, 215, 0, 0.4) 100.15%)',
        'golden': '#2B2B2B',
        'lay': "url('./Pages/lay.jpg')",
        'don': "url('./Pages/don.png')", 
        'eo': "url('./Pages/ho.png')",
        'eom': "url('./Pages/hom.png')",
        'screen': "url('./Pages/screen.png')",
        'sinc': '#E6E6E6',
        'CharcoalGray': '#424242',
      },
    },
  },
  plugins: [],
}
