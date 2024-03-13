/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    // screens: {
    //   '1170px': '1170px',
    //   // => @media (min-width: 640px) { ... }

    //   'laptop': '1024px',
    //   // => @media (min-width: 1024px) { ... }

    //   'desktop': '1280px',
    //   // => @media (min-width: 1280px) { ... }
    // },
    extend: {
      keyframes: {
        loading: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
      animation: {
        loading: 'loading 4s ease-out infinite',
      },
      backgroundImage: {
        'gameShards': "url('/src/images/icons/game-item-shards.svg')",
        'gameLeftToRightShards': "url('/src/images/icons/from-left-shards.svg')",
      },
      backgroundColor: {
        'yellow': 'rgb(255, 241, 0)',
        'hoverYellow': 'rgb(210, 199, 6)',
        'gray': '#898989',
        'hoverGray': '#626262',
        'lighterGray': 'rgb(27, 27, 27)',
      },
      colors: {
        'yellow': 'rgb(255, 241, 0)',
        'hoverYellow': 'rgb(210, 199, 6)',
        'gray': '#898989',
        'textGray': 'rgb(137, 137, 137)',
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