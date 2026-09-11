import type { Meta, StoryObj } from '@storybook/react';
import { BalanceSummary } from './BalanceSummary';

const meta: Meta<typeof BalanceSummary> = {
  title: 'Organisms/BalanceSummary',
  component: BalanceSummary,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BalanceSummary>;

export const Default: Story = {
  args: {
    income: 3500.00,
    expenses: -1250.75,
  }
};

export const Zero: Story = {
  args: {
    income: 0,
    expenses: 0,
  }
};

export const OnlyIncome: Story = {
  args: {
    income: 2000.00,
    expenses: 0,
  }
};

export const OnlyExpenses: Story = {
  args: {
    income: 0,
    expenses: -500.00,
  }
};