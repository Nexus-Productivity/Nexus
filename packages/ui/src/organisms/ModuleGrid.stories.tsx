import type { Meta, StoryObj } from "@storybook/react";
import { ModuleGrid } from "./ModuleGrid";
import { WalletIcon, FileTextIcon, ChartIcon } from "../atoms/Icons";

const meta: Meta<typeof ModuleGrid> = {
  title: "Organisms/ModuleGrid",
  component: ModuleGrid,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ModuleGrid>;

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
  },
};