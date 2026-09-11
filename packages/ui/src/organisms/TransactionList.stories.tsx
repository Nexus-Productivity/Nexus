import type { Meta, StoryObj } from '@storybook/react';
import { TransactionList } from './TransactionList';

const meta: Meta<typeof TransactionList> = {
  title: 'Organisms/TransactionList',
  component: TransactionList,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TransactionList>;

const transactions = [
  {
    id: '1',
    description: 'Pago de cliente',
    amount: 1500.00,
    date: '2024-01-15',
    type: 'income' as const,
  },
  {
    id: '2',
    description: 'Compra de suministros',
    amount: -250.75,
    date: '2024-01-16',
    type: 'expense' as const,
  },
  {
    id: '3',
    description: 'Transferencia a cuenta ahorros',
    amount: -500.00,
    date: '2024-01-17',
    type: 'transfer' as const,
  },
];

export const Default: Story = {
  args: {
    transactions,
  }
};

export const Loading: Story = {
  args: {
    loading: true,
  }
};

export const Empty: Story = {
  args: {
    transactions: [],
    emptyMessage: 'Aún no hay transacciones',
  }
};

export const WithCustomClass: Story = {
  args: {
    transactions,
    className: 'border-nexus-gold',
  }
};