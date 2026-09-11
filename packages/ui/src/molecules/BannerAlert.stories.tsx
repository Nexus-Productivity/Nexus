import type { Meta, StoryObj } from "@storybook/react";
import { BannerAlert } from "./BannerAlert";

const meta: Meta<typeof BannerAlert> = {
  title: "Molecules/BannerAlert",
  component: BannerAlert,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BannerAlert>;

export const SaldoMinimo: Story = {
  args: {
    title: "Saldo por debajo del mínimo",
    tone: "gold",
    children:
      "El saldo actual ($ 3.032,75) está por debajo del mínimo configurado ($ 5.000). Reponé la caja para seguir operando.",
  },
};

export const Exito: Story = {
  args: { title: "Arqueo cerrado correctamente", tone: "green", children: "No hubo diferencia entre el saldo esperado y el conteo físico." },
};

export const Error: Story = {
  args: { title: "No se pudo registrar el movimiento", tone: "red", children: "Revisá los campos e intentá de nuevo." },
};