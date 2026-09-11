/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ner: {
          bg: "#090d16",
          panel: "rgba(15, 23, 42, 0.75)",
          border: "rgba(255, 255, 255, 0.12)",
          accent: "#38bdf8",
          verylow: "#22c55e",
          low: "#eab308",
          medium: "#f97316",
          high: "#dc2626",
          critical: "#991b1b",
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
