/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,md}", "./_includes/**/*.{njk,md}", "./src/**/*.svg",],
  theme: {
    p: { fontSize: "1.5rem" },
    extend: {},
  },
  plugins: [],
}
