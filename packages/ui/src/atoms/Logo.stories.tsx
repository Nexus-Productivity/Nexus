import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "./Logo";

const meta: Meta<typeof Logo> = {
  title: "Atoms/Logo",
  component: Logo,
  tags: ["autodocs"],
  parameters: {
    controls: { include: ["size", "starRotation", "starSize", "starClassName", "className"] },
  },
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  args: { size: "md", starRotation: 15, starSize: 100 },
};

/** Variantes de posición/tamaño de la estrella para encontrar el punto exacto. */
export const StarTuning: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-6">
      <Logo size="md" />
      <Logo size="md" starSize={70} starRotation={0} />
      <Logo size="md" starSize={120} starRotation={45} starClassName="-top-[0.15em] -left-[0.2em]" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-6">
      <Logo size="sm" />
      <Logo size="md" />
      <Logo size="lg" />
    </div>
  ),
};

export const RotatedStar: Story = {
  args: { size: "md", starRotation: 45 },
};

export const OnDark: Story = {
  args: { size: "lg", starRotation: 15 },
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: (args) => (
    <div className="bg-nexus-ink p-8">
      <Logo {...args} className="text-white" />
    </div>
  ),
};