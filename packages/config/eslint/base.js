/** Config compartida de ESLint del ecosistema Nexus. */
module.exports = {
  root: true,
  extends: ["eslint:recommended"],
  env: { node: true, browser: true, es2022: true },
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  ignorePatterns: ["node_modules", "dist", ".next", ".turbo"],
};