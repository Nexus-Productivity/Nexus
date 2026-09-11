import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Atoms/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: { type: 'select' } },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    variant: 'outline',
    children: '✓',
  }
};

export const Gold: Story = {
  args: {
    variant: 'gold',
    children: '+',
  }
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Settings',
  }
};

export const WithClickHandler: Story = {
  args: {
    variant: 'outline',
    children: '▶',
    onClick: () => alert('Clicked!'),
  }
};