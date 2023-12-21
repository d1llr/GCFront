/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    extend: {
      backgroundColor: {
        'yellow': '#FFF100'
      },
      colors: {
        'yellow': '#FFF100',
        'gray': '#898989'
      },
      borderColor: {
        'gray': '#3F3F3F'
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}