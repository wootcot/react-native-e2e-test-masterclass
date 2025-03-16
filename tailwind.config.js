/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: (colors) => ({
        ...colors,
        black: "#111111",
        white: "#f5f5f5",
        app: {
          blue: "#10375c",
          error: "#a30000",
          orange: "#eb8317",
        },
      }),
    },
  },
  plugins: [],
};
