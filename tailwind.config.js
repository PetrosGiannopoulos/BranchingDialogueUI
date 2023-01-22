/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      keyframes: {
        wave: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },

        wiggle: {
          '0%, 100%': {
            'transform': 'translateY(-5%) translateX(2.5%)',
            'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '37.5%':{
            'transform': 'translateY(5%) translateX(2.5%)',
            'animation-timing-function': 'cubic-bezier(0.8, 0.8, 0.8, -1)',
          },
          '87.5%':{
            'transform': 'translateY(5%) translateX(2.5%)',
            'animation-timing-function': 'cubic-bezier(0, 0.8, 0.8, -1)',
          },
          '50%': {
            'transform': 'translateY(0) translateX(0)',
            'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
          },
          '25%, 75%': {
            'transform': 'translateY(5%) translateX(-2.5%)',
            'animation-timing-function': 'cubic-bezier(0, 0.8, 0.8, -1)',
          },
        }
      },
      animation: {
        'waving-hand': 'wave 5s ease infinite',
        'wiggle': 'wiggle 5s ease infinite',
      },
      padding:{
        '1/3': '33.33333%',
        '2/3': '66.66667%',
        '2/5': '40%',
      },
      fontFamily: {
        changa: ['Changa'],
        changaOne: ['Changa One'],
        lato: ['Lato'],
        nunito: ['Nunito Sans'],
      },
      colors: {
        toolbarbg: {
          '1': '#121619',
          '2': '#20202f',
          '3': '#1A1C24',
        },
        
        mainBg:{
          '1': '#121619',
          '2': '#000000',
          '3': '#E06C75',
          '4': '#992C34',
          '5': '#D17C56',
          '6': '#61AFEF',
        },
        
        lightDesign: {
          'white': '#fcfcfc',
          'black': '#292525',
          'red': '#aa1426',
        },

        lightDesign2: {
          'white': '#f9fdf5',
          'purple': '#521b3a',
          'red': '#a92931',
        },

        lightDesign3: {
          'white': '#f9f9ff',
          'black': '#2e3c4f',
          'red': '#dc3e31',
          'gray': '#b4a1b0',
        },

        lightDesign4: {
          'white': '#f8fdff',
          'black': '#12394b',
          'red': '#d53d29',
          'blue': '#37acdb',
        },

        darkDesign: {
          'black': '#2b2d36',
          'white': '#f6fdf2',
          'bez': '#baa873',
        },

        darkDesign2: {
          'black': '#0b0f0a',
          'white': '#dfe0de',
          'brown': '#b44d32',
        },

        darkDesign3: {
          'black': '#2c2b3a',
          'green': '#9cccb7',
          'orange': '#e18c7a',
          'brown': '#877378',
        },

        darkDesign4: {
          'black': '#1f2533',
          'white': '#efeff3',
          'gray': '#9ba09a',
          'red': '#c13b4c',
        },

        illustration1: {
          'white': '#f7efe8',
          'black': '#002447',
          'red': '#c1535f',
          'pink': '#baa873',
          'orange': '#e89428',
          'blue': '#52b2b7',
        },

      }
    },
  },
  plugins: [],
  important: true,
  mode: 'jit',
}
