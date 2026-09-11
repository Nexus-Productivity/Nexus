import type { Meta, StoryObj } from "@storybook/react";
import { ModulesHomePage } from "./ModulesHomePage";
import { WalletIcon, FileTextIcon, ChartIcon } from "../atoms/Icons";

const meta: Meta<typeof ModulesHomePage> = {
  title: "Pages/ModulesHomePage",
  component: ModulesHomePage,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ModulesHomePage>;

export const Default: Story = {
  args: {
    modules: [
      {
        id: "caja-menor",
        name: "Caja menor",
        description: "Ingresos, egresos y control de la caja chica.",
        icon: <WalletIcon />,
        href: "/",
        enabled: true,
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
    ],
    header: {
      brandLabel: "Finance",
      links: [
        { label: "Usuarios", href: "/usuarios" },
        { label: "Configuración", href: "/configuracion" },
      ],
      user: { name: "Laura Rivas", initials: "LR" },
    },
  },
};