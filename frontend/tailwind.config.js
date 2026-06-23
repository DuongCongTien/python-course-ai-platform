/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 60px -30px rgba(30, 64, 175, 0.28)",
        card: "0 12px 35px -20px rgba(15, 23, 42, 0.24)",
      },
    },
  },
  plugins: [],
};
