import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from './FormField';
import { CurrencyInput } from '../atoms/CurrencyInput';

const meta: Meta<typeof FormField> = {
  title: 'Molecules/FormField',
  component: FormField,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  args: {
    label: 'Nombre',
    children: <input type="text" className="block w-full rounded-md border-0 px-3 py-2 text-base font-medium text-nexus-bg bg-nexus-gold/20 focus:outline-none focus:ring-2 focus:ring-nexus-amber focus:ring-offset-2" placeholder="Ej: Juan Pérez" />,
  }
};

export const WithError: Story = {
  args: {
    label: 'Email',
    children: <input type="email" className="block w-full rounded-md border-0 px-3 py-2 text-base font-medium text-nexus-bg bg-nexus-gold/20 focus:outline-none focus:ring-2 focus:ring-nexus-amber focus:ring-offset-2" placeholder="ejemplo@dominio.com" />,
    error: 'El email no es válido',
  }
};

export const WithHelperText: Story = {
  args: {
    label: 'Monto',
    children: <CurrencyInput value={100} onChange={(v) => console.log('Currency changed:', v)} placeholder="0.00" />,
    helperText: 'Ingrese el amount en euros',
  }
};

export const WithErrorAndHelper: Story = {
  args: {
    label: 'Fecha',
    children: <input type="date" className="block w-full rounded-md border-0 px-3 py-2 text-base font-medium text-nexus-bg bg-nexus-gold/20 focus:outline-none focus:ring-2 focus:ring-nexus-amber focus:ring-offset-2" />,
    error: 'La fecha es requerida',
    helperText: 'Seleccione una fecha válida',
  }
};