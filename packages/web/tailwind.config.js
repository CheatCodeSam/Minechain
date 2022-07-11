/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["packages/web/src/**/index.html", "packages/web/src/**/*.{ts,tsx}"],
  theme: {
    extend: {}
  },
  plugins: [require("daisyui")]
}
