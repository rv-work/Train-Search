/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "spin-medium": "spin 1.5s linear infinite",
        "spin-fast": "spin 0.75s linear infinite",
      },
    },
  },
  plugins: [],
}