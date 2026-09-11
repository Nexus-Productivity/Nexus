import type { Meta, StoryObj } from '@storybook/react';
import { CajaMenorDashboardLayout } from './CajaMenorDashboardLayout';
import { BalanceSummary } from '../organisms/BalanceSummary';
import { TransactionList } from '../organisms/TransactionList';

const meta: Meta<typeof CajaMenorDashboardLayout> = {
  title: 'Templates/CajaMenorDashboardLayout',
  component: CajaMenorDashboardLayout,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CajaMenorDashboardLayout>;

const transactions = [
  { id: '1', description: 'Pago de cliente', amount: 1500, date: '2024-01-15', type: 'income' as const },
  { id: '2', description: 'Compra de suministros', amount: -250, date: '2024-01-16', type: 'expense' as const },
];

export const Default: Story = {
  args: {
    sidebarContent: (
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-nexus-star">Menú</h3>
        <nav className="space-y-2">
          <a href="#" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-nexus-star/20">
            Dashboard
          </a>
          <a href="#" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-nexus-star/20">
            Transacciones
          </a>
        </nav>
      </div>
    ),
    children: (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-nexus-star">Resumen</h2>
        <BalanceSummary income={3500} expenses={-1250} />
        <h2 className="text-xl font-semibold text-nexus-star">Transacciones recientes</h2>
        <TransactionList transactions={transactions} />
      </div>
    )
  }
};

export const WithoutSidebar: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-nexus-star">Contenido completo</h2>
        <p className="text-nexus-muted">Este es un ejemplo de contenido que ocupa todo el ancho.</p>
      </div>
    )
  }
};