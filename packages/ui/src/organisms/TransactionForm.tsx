"use client";
import React, { useState } from 'react';
import { FormField } from '../molecules/FormField';
import { CurrencyInput } from '../atoms/CurrencyInput';
import { DateInput } from '../atoms/DateInput';
import { IconButton } from '../atoms/IconButton';

interface TransactionFormProps {
  onSubmit: (transaction: {
    description: string;
    amount: number;
    date: string;
    type: 'income' | 'expense' | 'transfer';
  }) => void;
  initialValues?: Partial<{
    description: string;
    amount: number;
    date: string;
    type: 'income' | 'expense' | 'transfer';
  }>;
  className?: string;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  initialValues,
  className = ''
}) => {
  const [form, setForm] = useState({
    description: initialValues?.description ?? '',
    amount: initialValues?.amount ?? 0,
    date: initialValues?.date ?? '',
    type: initialValues?.type ?? 'income',
  });

  const handleChange = (field: keyof typeof form, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    // Optionally reset form after submit
    setForm({
      description: '',
      amount: 0,
      date: '',
      type: 'income',
    });
  };

  return (
    <form onSubmit={handleSubmit} className={`${className} space-y-4`}>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Descripción"
          helperText="Describa la transacción"
        >
          <input
            type="text"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="block w-full rounded-md border border-nexus-border bg-nexus-surface px-3 py-2 text-sm text-nexus-ink placeholder:text-nexus-muted focus:outline-none focus:ring-2 focus:ring-nexus-brand/30"
            placeholder="Ej: Pago de cliente"
          />
        </FormField>

        <FormField
          label="Monto"
          helperText="Ingrese el amount (use negativo para gastos)"
        >
          <CurrencyInput
            value={form.amount}
            onChange={(value) => handleChange('amount', value)}
            placeholder="0.00"
          />
        </FormField>

        <FormField
          label="Fecha"
          helperText="Seleccione la fecha de la transacción"
        >
          <DateInput
            value={form.date}
            onChange={(value) => handleChange('date', value)}
            placeholder="Seleccione fecha"
          />
        </FormField>

        <FormField label="Tipo">
          <div className="flex gap-4">
            <label className="flex items-center text-sm font-medium text-nexus-ink">
              <input
                type="radio"
                checked={form.type === 'income'}
                onChange={() => handleChange('type', 'income')}
                className="h-4 w-4 accent-nexus-green-strong"
              />
              Ingreso
            </label>
            <label className="flex items-center text-sm font-medium text-nexus-ink">
              <input
                type="radio"
                checked={form.type === 'expense'}
                onChange={() => handleChange('type', 'expense')}
                className="h-4 w-4 accent-nexus-red-strong"
              />
              Gasto
            </label>
            <label className="flex items-center text-sm font-medium text-nexus-ink">
              <input
                type="radio"
                checked={form.type === 'transfer'}
                onChange={() => handleChange('type', 'transfer')}
                className="h-4 w-4 accent-nexus-gold-strong"
              />
              Transferencia
            </label>
          </div>
        </FormField>
      </div>

      <div className="flex justify-end">
        <IconButton variant="primary" onClick={handleSubmit}>
          Guardar
        </IconButton>
      </div>
    </form>
  );
};