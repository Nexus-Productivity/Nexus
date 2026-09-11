import type { Meta, StoryObj } from '@storybook/react';
import { CurrencyDisplay } from './CurrencyDisplay';

const meta: Meta<typeof CurrencyDisplay> = {
  title: 'Molecules/CurrencyDisplay',
  component: CurrencyDisplay,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CurrencyDisplay>;

export const Positive: Story = {
  args: {
    amount: 1250.50,
    currencyCode: 'EUR',
    showSign: false,
  }
};

export const Negative: Story = {
  args: {
    amount: -85.30,
    currencyCode: 'EUR',
    showSign: false,
  }
};

export const WithSign: Story = {
  args: {
    amount: 100.00,
    currencyCode: 'USD',
    showSign: true,
  }
};

export const Zero: Story = {
  args: {
    amount: 0,
    currencyCode: 'EUR',
    showSign: false,
  }
};