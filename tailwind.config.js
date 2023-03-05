/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/parts/*", "./src/js/*", "./src/index.html"],
  theme: {
    fontFamily: {
      "display": ['Poppins']
    },
    colors: {
      "lofGreen": "#045124",
      "lofDarkGreen": "#08110B",
      "white": "#FFFFFF",
      "black": "#000000",
      "lightYellow": "#ffff7f",
      "lightBlue": "#70f1ff",
      "nonopaqueBlack": "#00000075",
    },
    extend: {},
  },
  plugins: [],
}
