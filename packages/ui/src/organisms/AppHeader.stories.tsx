import type { Meta, StoryObj } from "@storybook/react";
import { AppHeader } from "./AppHeader";

const meta: Meta<typeof AppHeader> = {
  title: "Organisms/AppHeader",
  component: AppHeader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AppHeader>;

export const Default: Story = {
  args: {
    appHref: "/",
    brandLabel: "Finance",
    links: [
      { label: "Usuarios", href: "/usuarios" },
      { label: "Configuración", href: "/configuracion" },
    ],
    user: { name: "Laura Rivas", initials: "LR" },
  },
};

export const SinUsuario: Story = {
  args: {
    brandLabel: "Finance",
    links: [{ label: "Usuarios", href: "/usuarios" }],
  },
};