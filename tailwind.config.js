/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify the files Tailwind should scan for class names
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {},  // No custom theme extensions at the moment
  },
  plugins: [],  // No additional Tailwind plugins used
};
