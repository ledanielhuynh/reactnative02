module.exports = {
  content: [
    "./App.jsx",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'space': ["SpaceGrotesk", "sans-serif"],
        'space-bold': ["SpaceGroteskBold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
