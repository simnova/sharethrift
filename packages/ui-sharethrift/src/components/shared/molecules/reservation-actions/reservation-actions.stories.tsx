import type { Meta, StoryObj } from '@storybook/react';
import { ReservationActions } from './reservation-actions';

const meta: Meta<typeof ReservationActions> = {
  title: 'Molecules/ReservationActions',
  component: ReservationActions,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['REQUESTED', 'ACCEPTED', 'REJECTED', 'RESERVATION_PERIOD', 'CANCELLED'],
    },
    cancelLoading: {
      control: 'boolean',
    },
    closeLoading: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Requested: Story = {
  args: {
    status: 'REQUESTED',
    onCancel: () => console.log('Cancel clicked'),
    onClose: () => console.log('Close clicked'),
    onMessage: () => console.log('Message clicked'),
  },
};

export const Accepted: Story = {
  args: {
    status: 'ACCEPTED',
    onCancel: () => console.log('Cancel clicked'),
    onClose: () => console.log('Close clicked'),
    onMessage: () => console.log('Message clicked'),
  },
};

export const Rejected: Story = {
  args: {
    status: 'REJECTED',
    onCancel: () => console.log('Cancel clicked'),
    onClose: () => console.log('Close clicked'),
    onMessage: () => console.log('Message clicked'),
  },
};

export const Cancelled: Story = {
  args: {
    status: 'CANCELLED',
    onCancel: () => console.log('Cancel clicked'),
    onClose: () => console.log('Close clicked'),
    onMessage: () => console.log('Message clicked'),
  },
};

export const LoadingStates: Story = {
  args: {
    status: 'REQUESTED',
    onCancel: () => console.log('Cancel clicked'),
    onClose: () => console.log('Close clicked'),
    onMessage: () => console.log('Message clicked'),
    cancelLoading: true,
  },
};