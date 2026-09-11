import type { Meta, StoryObj } from "@storybook/react";
import { DashboardPage } from "./DashboardPage";
import { WalletIcon } from "../atoms/Icons";

const meta: Meta<typeof DashboardPage> = {
  title: "Pages/DashboardPage",
  component: DashboardPage,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DashboardPage>;

const sidebar = {
  backHref: "/",
  title: "Caja menor",
  icon: <WalletIcon />,
  sections: [
    {
      label: "Operación",
      items: [
        { label: "Dashboard", href: "#dashboard" },
        { label: "Movimientos", href: "#movimientos" },
        { label: "Solicitudes", href: "#solicitudes" },
        { label: "Arqueos", href: "#arqueos" },
      ],
    },
    {
      label: "Control",
      items: [
        { label: "Comprobantes", href: "#comprobantes" },
        { label: "Reportes", href: "#reportes" },
        { label: "Auditoría", href: "#auditoria" },
      ],
    },
    {
      label: "Módulo",
      items: [{ label: "Categorías", href: "#categorias" }],
    },
  ],
  user: { name: "Laura Rivas", initials: "LR" },
  activeHref: "#dashboard",
};

export const Default: Story = {
  args: { sidebar },
};

export const SaldoBajoMinimo: Story = {
  args: { sidebar, balance: 800, minBalance: 5000 },
};