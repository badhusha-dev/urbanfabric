/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00e5ff',
        'neon-green': '#00ffa3',
      },
      fontFamily: {
        'hero': ['Orbitron', 'sans-serif'],
        'base': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
