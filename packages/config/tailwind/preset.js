/**
 * Preset Tailwind compartido del ecosistema Nexus.
 *
 * Estética "papel estelar" (modo claro por defecto):
 *  - Día: papel cálido + tinta dorada (productos Nexus Finance).
 *  - Noche: espacio negro + estrellas doradas (login/branding) vía clase `.dark`.
 *
 * Los colores son variables CSS semánticas definidas en `nexus-colors.css`
 * (los consumidores la importan en su globals.css). Esto permite:
 *  - Un solo juego de nombres de tokens para ambos modos.
 *  - Opacidades con <alpha-value> (ej: bg-nexus-gold/30).
 */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        nexus: {
          // Neutros semánticos (cambian con el modo)
          bg: "rgb(var(--nexus-bg) / <alpha-value>)",
          surface: "rgb(var(--nexus-surface) / <alpha-value>)",
          "surface-alt": "rgb(var(--nexus-surface-alt) / <alpha-value>)",
          border: "rgb(var(--nexus-border) / <alpha-value>)",
          ink: "rgb(var(--nexus-ink) / <alpha-value>)",
          muted: "rgb(var(--nexus-muted) / <alpha-value>)",
          brand: "rgb(var(--nexus-brand) / <alpha-value>)",

          // Dorado — marca / atención (3 tonos: fondo suave · texto · valor)
          "gold-soft": "rgb(var(--nexus-gold-soft) / <alpha-value>)",
          "gold-text": "rgb(var(--nexus-gold-text) / <alpha-value>)",
          "gold-strong": "rgb(var(--nexus-gold-strong) / <alpha-value>)",

          // Verde — éxito / ingresos / aprobado
          "green-soft": "rgb(var(--nexus-green-soft) / <alpha-value>)",
          "green-text": "rgb(var(--nexus-green-text) / <alpha-value>)",
          "green-strong": "rgb(var(--nexus-green-strong) / <alpha-value>)",

          // Rojo — error / egresos / negativo
          "red-soft": "rgb(var(--nexus-red-soft) / <alpha-value>)",
          "red-text": "rgb(var(--nexus-red-text) / <alpha-value>)",
          "red-strong": "rgb(var(--nexus-red-strong) / <alpha-value>)",

          // Aliases legacy (compatibilidad; apuntan al tono principal del modo)
          star: "rgb(var(--nexus-brand) / <alpha-value>)",
          gold: "rgb(var(--nexus-gold-text) / <alpha-value>)",
          amber: "rgb(var(--nexus-gold-text) / <alpha-value>)",
          green: "rgb(var(--nexus-green-text) / <alpha-value>)",
          red: "rgb(var(--nexus-red-text) / <alpha-value>)",
          destructive: "rgb(var(--nexus-red-text) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};