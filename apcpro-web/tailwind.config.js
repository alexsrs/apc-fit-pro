/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-animate"),
    // outros plugins se necessário
  ],
  safelist: [
    {
      pattern: /group-\[sidebar-wrapper-data-collapsible=icon\]:sr-only/,
    },
  ],
};
