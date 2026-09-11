import type { Meta, StoryObj } from "@storybook/react";
import { StatCard } from "./StatCard";

const meta: Meta<typeof StatCard> = {
  title: "Molecules/StatCard",
  component: StatCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const Saldo: Story = {
  args: { label: "Saldo actual", value: "$ 3.032,75", tone: "gold" },
};

export const Ingresos: Story = {
  args: { label: "Ingresos (mes)", value: "$ 5.000", tone: "green", footnote: "+12% vs mes anterior" },
};

export const Gastos: Story = {
  args: { label: "Gastos (mes)", value: "$ 2.867,25", tone: "red" },
};

export const Neutral: Story = {
  args: { label: "Pendientes de soporte", value: "3", tone: "neutral" },
};