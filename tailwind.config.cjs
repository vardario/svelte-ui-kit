const config = {
  content: ['./src/**/*.{html,js,svelte,ts,md}', './node_modules/@vardario/svelte-ui-kit/**/*.{html,js,svelte,ts}'],
  plugins: [require('flowbite/plugin')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F6F5FF",
          100: "#EAE6FE",
          200: "#D4CEFD",
          300: "#B6ABFC",
          400: "#9484FB",
          500: "#5136F8",
          600: "#3E21F7",
          700: "#2708F2",
          800: "#1F06BB",
          900: "#160585",
          950: "#0F035E"
        }
      }
    }
  }
};

module.exports = config;
