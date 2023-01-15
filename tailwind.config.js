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
          '6': '#C77F77',
        },
        
      }
    },
  },
  plugins: [],
}
