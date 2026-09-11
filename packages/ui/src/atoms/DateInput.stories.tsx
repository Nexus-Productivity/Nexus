import type { Meta, StoryObj } from '@storybook/react';
import { DateInput } from './DateInput';

const meta: Meta<typeof DateInput> = {
  title: 'Atoms/DateInput',
  component: DateInput,
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof DateInput>;

export const Default: Story = {
  args: {
    value: '2024-01-15',
    onChange: (value) => console.log('Date changed to:', value),
    placeholder: 'Select date',
  }
};

export const Empty: Story = {
  args: {
    value: '',
    onChange: (value) => console.log('Date changed to:', value),
    placeholder: 'Select date',
  }
};

export const WithMinMax: Story = {
  args: {
    value: '2024-02-01',
    onChange: (value) => console.log('Date changed to:', value),
    placeholder: 'Select date',
    min: '2024-01-01',
    max: '2024-12-31',
  }
};