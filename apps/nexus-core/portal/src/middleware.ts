export { default } from "next-auth/middleware";

/**
 * Prototipo GYM (rama gym/prototipo): todo lo privado requiere sesión.
 * Público: /login, /registro, /api.
 * Las páginas (protected) re-verifican sesión + org gym en el layout.
 */
export const config = {
  matcher: ["/", "/clientes/:path*", "/pagos", "/gastos", "/onboarding"],
};