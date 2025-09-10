import type { Meta, StoryObj } from '@storybook/react';
import { ReserveButton } from './reserve-button';

const meta = {
  title: 'Components/View Listing/ReserveButton',
  component: ReserveButton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: { type: 'select' },
      options: ['reserve', 'cancel', 'loading', 'disabled'],
    },
  },
} satisfies Meta<typeof ReserveButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    state: 'reserve',
    onClick: () => console.log('Reserve button clicked'),
  },
};

export const Cancel: Story = {
  args: {
    state: 'cancel',
    onClick: () => console.log('Cancel button clicked'),
  },
};

export const Loading: Story = {
  args: {
    state: 'loading',
    onClick: () => console.log('Loading button clicked'),
  },
};

export const Disabled: Story = {
  args: {
    state: 'disabled',
    onClick: () => console.log('Disabled button clicked'),
  },
};

export const DisabledReserve: Story = {
  args: {
    state: 'reserve',
    disabled: true,
    onClick: () => console.log('Disabled reserve button clicked'),
  },
};