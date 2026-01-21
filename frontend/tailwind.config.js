/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // include all Vite React files
  ],
  theme: {
    extend: {
      keyframes: {
        "gradient-x": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        "gradient-y": {
          "0%, 100%": { "background-position": "50% 0%" },
          "50%": { "background-position": "50% 100%" },
        },
      },
      animation: {
        "gradient-x": "gradient-x 15s ease infinite",
        "gradient-y": "gradient-y 15s ease infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
