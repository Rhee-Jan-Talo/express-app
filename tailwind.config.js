/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{css, js}",'./views/*.ejs'
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'brown1': '#5E4E43',
      'brown2': '#27221F',
      'White': '#FFFFFF',
      'yellow': '#ECC085',
      'greay': '#D9D9D9',
      
    },
    extend: {},
  },
  plugins: [
    require('tailwindcss'),
    ],
}

