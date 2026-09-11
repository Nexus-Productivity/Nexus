import type { Meta, StoryObj } from "@storybook/react";
import { PagePlaceholder } from "./PagePlaceholder";
import { ShieldIcon } from "../atoms/Icons";

const meta: Meta<typeof PagePlaceholder> = {
  title: "Molecules/PagePlaceholder",
  component: PagePlaceholder,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PagePlaceholder>;

export const Default: Story = {
  args: {
    title: "Auditoría",
    description: "Registro de quién hizo qué y cuándo en el módulo de Caja Menor.",
    icon: <ShieldIcon />,
  },
};