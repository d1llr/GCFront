/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gameShards': "url('/src/images/icons/game-item-shards.svg')",
        'gameLeftToRightShards': "url('/src/images/icons/from-left-shards.svg')",
      },
      backgroundColor: {
        'yellow': '#FFF100'
      },
      colors: {
        'yellow': '#FFF100',
        'hoverYellow': 'rgb(210, 199, 6)',
        'gray': '#898989',
        'lightGray': 'rgb(39, 39, 39)',
        'lightGrayHover': 'rgba(98, 98, 98, 1)',
        'customBlack': 'rgb(13, 13, 13)',
        'customBlackHover': 'rgb(27, 27, 27)',
        'urlGray': 'rgb(98, 98, 98)',
        'eyeBlack': 'rgba(0, 0, 0, 0.25)',
      },
      borderColor: {
        'gray': '#3F3F3F'
      },
      content: {
        'exit': 'url("/src/images/icons/exit-account.svg")',
      },
    },
    fontFamily: {
      orbitron: [
        '"Orbitron", sans-serif',
      ],
      beausans: [
        '"PF BeauSans Pro", sans-serif'
      ],
      chakra: [
        '"Chakra Petch", sans-serif'
      ]
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}