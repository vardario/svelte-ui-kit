const config = {
  content: ['./src/**/*.{html,js,svelte,ts,md}', './node_modules/@vardario/svelte-ui-kit/**/*.{html,js,svelte,ts}'],
  plugins: [require('flowbite/plugin')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#FFE5F6",
          100: "#FFCCEC",
          200: "#FF99DA",
          300: "#FF66C7",
          400: "#FF33B4",
          500: "#FF00A1",
          600: "#CC0081",
          700: "#990061",
          800: "#660041",
          900: "#330020",
          950: "#190010"
        }
      }
    }
  }
};

module.exports = config;
