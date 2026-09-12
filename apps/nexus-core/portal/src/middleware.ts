export { default } from "next-auth/middleware";

/**
 * Todo lo que no sea pública (login/registro/api) requiere sesión.
 * El flujo: /login → Home (redirige al negocio ACTIVO o a /ceo) →
 * /negocios/[slug] → módulos. /ceo requiere scope CEO (check en la página).
 */
export const config = {
  matcher: ["/", "/negocios/:path*", "/explorar", "/ceo"],
};