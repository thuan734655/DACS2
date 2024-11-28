/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-dark": "rgba(21, 45, 67, 0.164)",
      },
    },
  },
  plugins: [require("tailwindcss-motion")],
  plugins: [
    require("tailwind-scrollbar-hide")],
};
