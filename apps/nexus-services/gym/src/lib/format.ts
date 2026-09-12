import { ORG } from "./org";

/** Formato de dinero en la moneda de la organización (COP por defecto). */
export function formatMoney(value: number): string {
  return new Intl.NumberFormat(ORG.locale, {
    style: "currency",
    currency: ORG.currency,
    maximumFractionDigits: 0,
  }).format(Math.abs(value));
}

/** Formato compacto para ejes de gráficas: $5.4M, $3.2M, $800K. */
export function formatCompact(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000) {
    return `${sign}$${(abs / 1_000_000).toFixed(1).replace(".0", "")}M`;
  }
  if (abs >= 1_000) {
    return `${sign}$${Math.round(abs / 1_000)}K`;
  }
  return `${sign}$${abs}`;
}

/** Fecha corta localizada: 11 sep 2026. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(ORG.locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}