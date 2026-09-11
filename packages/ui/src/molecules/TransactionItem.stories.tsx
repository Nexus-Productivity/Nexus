import type { Meta, StoryObj } from '@storybook/react';
import { TransactionItem } from './TransactionItem';

const meta: Meta<typeof TransactionItem> = {
  title: 'Molecules/TransactionItem',
  component: TransactionItem,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TransactionItem>;

export const Income: Story = {
  args: {
    id: '1',
    description: 'Pago de cliente',
    amount: 1500.00,
    date: '2024-01-15',
    type: 'income',
  }
};

export const Expense: Story = {
  args: {
    id: '2',
    description: 'Compra de suministros',
    amount: -250.75,
    date: '2024-01-16',
    type: 'expense',
  }
};

export const Transfer: Story = {
  args: {
    id: '3',
    description: 'Transferencia a cuenta ahorros',
    amount: -500.00,
    date: '2024-01-17',
    type: 'transfer',
  }
};

export const WithCustomClass: Story = {
  args: {
    id: '4',
    description: 'Servicio profesional',
    amount: 800.00,
    date: '2024-01-18',
    type: 'income',
    className: 'border-nexus-gold',
  }
};