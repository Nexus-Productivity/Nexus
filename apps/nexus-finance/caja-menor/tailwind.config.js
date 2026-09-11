const preset = require("@nexus/config/tailwind");

module.exports = {
  presets: [preset],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    // Correcto: desde apps/nexus-finance/caja-menor → ../../../packages/ui/src
    "../../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
};
