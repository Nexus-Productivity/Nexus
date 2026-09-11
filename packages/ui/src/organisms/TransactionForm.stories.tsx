import type { Meta, StoryObj } from '@storybook/react';
import { TransactionForm } from './TransactionForm';

const meta: Meta<typeof TransactionForm> = {
  title: 'Organisms/TransactionForm',
  component: TransactionForm,
  tags: ['autodocs'],
  argTypes: {
    onSubmit: { action: 'submitted' },
  },
};

export default meta;
type Story = StoryObj<typeof TransactionForm>;

export const Default: Story = {
  args: {
    onSubmit: (data) => console.log('Form submitted:', data),
    initialValues: {
      description: 'Pago de cliente',
      amount: 1000,
      date: '2024-01-15',
      type: 'income',
    },
  }
};

export const Empty: Story = {
  args: {
    onSubmit: (data) => console.log('Form submitted:', data),
  }
};

export const ExpenseForm: Story = {
  args: {
    onSubmit: (data) => console.log('Form submitted:', data),
    initialValues: {
      description: 'Compra de oficina',
      amount: -250.50,
      date: '2024-01-16',
      type: 'expense',
    },
  }
};