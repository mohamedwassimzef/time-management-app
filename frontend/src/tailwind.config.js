/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // your app files
    "./node_modules/@ilamy/calendar/dist/**/*.{js,ts,jsx,tsx,css}" // calendar package
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
