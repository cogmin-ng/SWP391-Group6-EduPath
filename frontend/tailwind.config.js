/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          primary: "#4F46E5", // Indigo 600
          secondary: "#6366F1", // Indigo 500
          dark: "#0F172A", // Slate 900
          light: "#F8FAFC", // Slate 50
        }
      }
    },
  },
  plugins: [],
}
