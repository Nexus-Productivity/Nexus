import {
  ModulesHomePage,
  WalletIcon,
  FileTextIcon,
  ChartIcon,
  type ModuleCardData,
} from "@nexus/ui";

const CAJA_URL = process.env.NEXT_PUBLIC_CAJA_URL ?? "http://localhost:3000";

const modules: ModuleCardData[] = [
  {
    id: "caja-menor",
    name: "Caja menor",
    description: "Ingresos, egresos y control de la caja chica.",
    icon: <WalletIcon />,
    href: CAJA_URL,
    enabled: true,
    status: "Activo",
  },
  {
    id: "facturacion",
    name: "Facturación",
    description: "Emisión y seguimiento de comprobantes.",
    icon: <FileTextIcon />,
    enabled: false,
  },
  {
    id: "presupuestos",
    name: "Presupuestos",
    description: "Planificación y control de presupuestos.",
    icon: <ChartIcon />,
    enabled: false,
  },
];

export default function HomePage() {
  return (
    <ModulesHomePage
      modules={modules}
      header={{
        brandLabel: "Finance",
        links: [
          { label: "Usuarios", href: "/usuarios" },
          { label: "Configuración", href: "/configuracion" },
        ],
        user: { name: "Laura Rivas", initials: "LR" },
      }}
    />
  );
}