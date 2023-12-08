/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor:{
        'yellow':'#FFF100'
      },
      colors:{
        'yellow':'#FFF100'
      },
      borderColor:{
        'gray': '#3F3F3F'
      }
    },
  },
  plugins: [],
}