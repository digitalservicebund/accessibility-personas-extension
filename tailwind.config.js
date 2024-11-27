/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js,json}"],
  theme: {
    extend: {
      ringWidth: {
        DEFAULT: "2px",
      },
      ringColor: {
        focus: "#000",
      },
      colors: {
        "focus-bg": "#fec32bff",
      },
    },
    fontFamily: {
      sans: ["Roboto", "sans-serif"],
    },
  },
  variants: {
    extend: {
      ringWidth: ["focus"],
      ringColor: ["focus"],
      backgroundColor: ["focus"],
    },
  },
  plugins: [],
};
