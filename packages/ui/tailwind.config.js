const preset = require("@nexus/config/tailwind");

module.exports = {
  presets: [preset],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./.storybook/**/*.{js,ts,jsx,tsx}",
  ],
};