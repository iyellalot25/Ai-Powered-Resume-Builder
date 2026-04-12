/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind WHERE to look for class names
  // so it only includes the CSS you actually use
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {}, // add custom colors/fonts here later
  },
  plugins: [],
}