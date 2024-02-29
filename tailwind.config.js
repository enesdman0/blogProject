/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,ejs}"],
  theme: {
    colors: {
      'night': '#004e8f'
    },
    extend: {
      fontFamily: {
        'bebas': ['Bebas Neue', 'sans-serif'],
        'open': ['Open Sans', 'sans-serif'],
      },

    },
    container: {
      center: true,
    },
  },
  plugins: [require("daisyui")],
}