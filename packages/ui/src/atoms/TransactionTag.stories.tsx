import type { Meta, StoryObj } from '@storybook/react';
import { TransactionTag } from './TransactionTag';

const meta: Meta<typeof TransactionTag> = {
  title: 'Atoms/TransactionTag',
  component: TransactionTag,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TransactionTag>;

export const Income: Story = {
  args: {
    type: 'income',
  }
};

export const Expense: Story = {
  args: {
    type: 'expense',
  }
};

export const Transfer: Story = {
  args: {
    type: 'transfer',
  }
};

export const CustomLabel: Story = {
  args: {
    type: 'income',
    label: 'Custom Label',
  }
};