import type { Meta, StoryObj } from '@storybook/react';
import { CurrencyInput } from './CurrencyInput';

const meta: Meta<typeof CurrencyInput> = {
  title: 'Atoms/CurrencyInput',
  component: CurrencyInput,
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof CurrencyInput>;

export const Default: Story = {
  args: {
    value: 1000.50,
    onChange: (value) => console.log('Value changed to:', value),
    placeholder: 'Enter amount',
  }
};

export const Zero: Story = {
  args: {
    value: 0,
    onChange: (value) => console.log('Value changed to:', value),
    placeholder: 'Enter amount',
  }
};

export const Empty: Story = {
  args: {
    value: undefined,
    onChange: (value) => console.log('Value changed to:', value),
    placeholder: 'Enter amount',
  }
};