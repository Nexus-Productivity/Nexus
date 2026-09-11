import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./Sidebar";
import { WalletIcon } from "../atoms/Icons";

const meta: Meta<typeof Sidebar> = {
  title: "Organisms/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const sections = [
  {
    label: "Operación",
    items: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Movimientos", href: "/movimientos" },
      { label: "Solicitudes", href: "/solicitudes" },
      { label: "Arqueos", href: "/arqueos" },
    ],
  },
  {
    label: "Control",
    items: [
      { label: "Comprobantes", href: "/comprobantes" },
      { label: "Reportes", href: "/reportes" },
      { label: "Auditoría", href: "/auditoria" },
    ],
  },
  {
    label: "Módulo",
    items: [{ label: "Categorías", href: "/categorias" }],
  },
];

export const Default: Story = {
  args: {
    backHref: "/",
    title: "Caja menor",
    icon: <WalletIcon />,
    sections,
    user: { name: "Laura Rivas", initials: "LR" },
    activeHref: "/dashboard",
  },
};

export const SinUsuario: Story = {
  args: {
    backHref: "/",
    title: "Caja menor",
    icon: <WalletIcon />,
    sections,
  },
};