import React from "react";

interface IconProps {
  className?: string;
}

function base(className?: string) {
  return {
    className,
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}

/** Destello — marca NEXUS (relleno). */
export const SparkleIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2l2.4 6.9L21 12l-6.6 3.1L12 22l-2.4-6.9L3 12l6.6-3.1L12 2z" />
  </svg>
);

/** Billetera — módulo Caja Menor. */
export const WalletIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...base(className)}>
    <rect x="3" y="6" width="18" height="13" rx="2.5" />
    <path d="M3 10h18" />
    <path d="M16 14.5h.01" />
  </svg>
);

/** Documento — módulo Facturación. */
export const FileTextIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...base(className)}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" />
    <path d="M14 3v5h5" />
    <path d="M9 13h6M9 17h6" />
  </svg>
);

/** Gráfico — módulo Presupuestos / Reportes. */
export const ChartIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...base(className)}>
    <path d="M4 20V4" />
    <path d="M4 20h16" />
    <rect x="7" y="11" width="3" height="6" rx="0.5" />
    <rect x="12" y="7" width="3" height="10" rx="0.5" />
    <rect x="17" y="13" width="3" height="4" rx="0.5" />
  </svg>
);

/** Usuarios — nivel app. */
export const UsersIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...base(className)}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6" />
    <circle cx="17" cy="9.5" r="2.4" />
    <path d="M15.5 14.6c2.4.2 4.2 1.7 4.7 4" />
  </svg>
);

/** Configuración — nivel app. */
export const SettingsIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...base(className)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z" />
  </svg>
);

/** Flecha atrás — volver a módulos. */
export const ChevronLeftIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...base(className)}>
    <polyline points="15 5 9 12 15 19" />
  </svg>
);

/** Alerta (triángulo) — banner de advertencia. */
export const AlertIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...base(className)}>
    <path d="M10.3 4.2 2.7 17.1a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z" />
    <path d="M12 9.5v4.5" />
    <path d="M12 17.5h.01" />
  </svg>
);

/** Plus — nueva entidad. */
export const PlusIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...base(className)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

/** Comprobante — fase 2. */
export const DocumentIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...base(className)}>
    <path d="M6 3h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
    <path d="M14 3v4h4" />
    <path d="M9 13h6M9 17h6" />
  </svg>
);

/** Escudo — auditoría. */
export const ShieldIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...base(className)}>
    <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3z" />
    <path d="m9.5 12 1.8 1.8 3.2-3.6" />
  </svg>
);

/** Bandeja — solicitudes. */
export const InboxIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...base(className)}>
    <path d="M4 4h16v16H4z" />
    <path d="M4 14h4l2 2.5h4L16 14h4" />
  </svg>
);

/** Arqueo. */
export const CoinsIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...base(className)}>
    <circle cx="8" cy="8" r="5" />
    <path d="M8 3a7.5 7.5 0 0 1 8 8" />
    <path d="M18.6 13.8a7.5 7.5 0 0 1-7 7" />
  </svg>
);

/** Cerrar sesión. */
export const LogOutIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...base(className)}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <path d="M21 12H9" />
  </svg>
);