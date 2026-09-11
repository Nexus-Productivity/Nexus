import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: "Nuevo movimiento" },
};

export const Secondary: Story = {
  args: { children: "Cancelar", variant: "secondary" },
};

export const Gold: Story = {
  args: { children: "Ver detalle", variant: "gold" },
};

export const Ghost: Story = {
  args: { children: "Ver más", variant: "ghost" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-3">
      <Button {...args} size="sm">Chico</Button>
      <Button {...args} size="md">Mediano</Button>
      <Button {...args} size="lg">Grande</Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { children: "Deshabilitado", disabled: true },
};