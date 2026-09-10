/** Preset Tailwind compartido del ecosistema Nexus. */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Estética Nexus: espacio negro, estrellas doradas, acentos dorado/naranja/amarillo
        nexus: {
          bg: "#0a0a0f", // espacio negro
          surface: "#14141c", // superficie
          border: "#23232e",
          gold: "#d4af37", // dorado principal
          amber: "#f59e0b", // ámbar de acento
          star: "#ffe9a8", // amarillo estrellas
          muted: "#8b8b98", // texto secundario
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};