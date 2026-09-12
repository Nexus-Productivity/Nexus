import {
  BarChart3,
  Building2,
  Dumbbell,
  ReceiptText,
  Store,
  UtensilsCrossed,
  Users,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/** Icono por módulo del catálogo (nivel 1 del producto). */
export const ICONO_MODULO: Record<string, LucideIcon> = {
  gym: Dumbbell,
  "caja-menor": Wallet,
  facturacion: ReceiptText,
  presupuestos: BarChart3,
  clientes: Users,
};

/** Icono por tipo de negocio (onboarding). */
export const ICONO_NEGOCIO: Record<string, LucideIcon> = {
  gimnasio: Dumbbell,
  comercio: Store,
  restaurante: UtensilsCrossed,
  taller: Wrench,
  plataforma: Building2,
};

export const ICONO_DEFAULT = Building2;

export function iconoModulo(slug: string): LucideIcon {
  return ICONO_MODULO[slug] ?? ICONO_DEFAULT;
}

export function iconoNegocio(tipo?: string | null): LucideIcon {
  return (tipo && ICONO_NEGOCIO[tipo]) || ICONO_DEFAULT;
}