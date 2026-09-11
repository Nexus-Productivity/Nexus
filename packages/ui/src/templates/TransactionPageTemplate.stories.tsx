import type { Meta, StoryObj } from '@storybook/react';
import { TransactionPageTemplate } from './TransactionPageTemplate';
import { TransactionForm } from '../organisms/TransactionForm';
import { TransactionList } from '../organisms/TransactionList';

const meta: Meta<typeof TransactionPageTemplate> = {
  title: 'Templates/TransactionPageTemplate',
  component: TransactionPageTemplate,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TransactionPageTemplate>;

const transactions = [
  { id: '1', description: 'Pago de cliente', amount: 1500, date: '2024-01-15', type: 'income' as const },
  { id: '2', description: 'Compra de suministros', amount: -250, date: '2024-01-16', type: 'expense' as const },
];

export const ListPage: Story = {
  args: {
    title: 'Transacciones',
    subtitle: 'Lista de todas las transacciones',
    children: (
      <TransactionList transactions={transactions} />
    )
  }
};

export const FormPage: Story = {
  args: {
    title: 'Nueva transacción',
    subtitle: 'Agregue una nueva transacción',
    children: (
      <TransactionForm onSubmit={(data) => console.log('Transaction added:', data)} />
    )
  }
};

export const WithCustomClass: Story = {
  args: {
    title: 'Mi página personalizada',
    children: <p className="text-nexus-muted">Contenido personalizado</p>,
    className: 'p-4 bg-nexus-muted/10 rounded-lg'
  }
};