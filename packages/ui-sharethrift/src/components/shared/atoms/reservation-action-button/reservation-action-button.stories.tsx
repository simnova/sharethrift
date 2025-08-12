import type { Meta, StoryObj } from '@storybook/react';
import { ReservationActionButton } from './reservation-action-button';

const meta: Meta<typeof ReservationActionButton> = {
  title: 'Atoms/ReservationActionButton',
  component: ReservationActionButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    action: {
      control: 'select',
      options: ['cancel', 'close', 'message'],
    },
    size: {
      control: 'select',
      options: ['small', 'middle', 'large'],
    },
    loading: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Cancel: Story = {
  args: {
    action: 'cancel',
    onClick: () => console.log('Cancel clicked'),
  },
};

export const Close: Story = {
  args: {
    action: 'close',
    onClick: () => console.log('Close clicked'),
  },
};

export const Message: Story = {
  args: {
    action: 'message',
    onClick: () => console.log('Message clicked'),
  },
};

export const Loading: Story = {
  args: {
    action: 'cancel',
    loading: true,
    onClick: () => console.log('Loading clicked'),
  },
};