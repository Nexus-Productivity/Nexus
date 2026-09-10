import { z } from "zod";

export const version = "0.0.0";

/** Schema base para IDs numéricos positivos (tablas con autoincrement). */
export const IdSchema = z.number().int().positive();

/** Schema para montos monetarios (ingresos/egresos de caja menor). */
export const MontoSchema = z
  .number()
  .positive("El monto debe ser mayor a 0")
  .max(1_000_000_000, "El monto excede el límite permitido");

/** Schema de fecha ISO para inputs del cliente. */
export const FechaSchema = z.string().datetime({ offset: true });

export { z };