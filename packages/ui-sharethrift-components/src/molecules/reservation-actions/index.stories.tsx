import type { Meta, StoryObj } from '@storybook/react';
import { ReservationActions } from './index.js';

const meta: Meta<typeof ReservationActions> = {
  title: 'Molecules/ReservationActions',
  component: ReservationActions,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['pending', 'accepted', 'rejected', 'cancelled', 'closing', 'closed'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'middle', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultHandlers = {
  onAccept: () => console.log('Accept clicked'),
  onReject: () => console.log('Reject clicked'),
  onCancel: () => console.log('Cancel clicked'),
  onClose: () => console.log('Close clicked'),
  onMessage: () => console.log('Message clicked'),
};

export const Pending: Story = {
  args: {
    status: 'pending',
    ...defaultHandlers,
  },
};

export const Accepted: Story = {
  args: {
    status: 'accepted',
    ...defaultHandlers,
  },
};

export const Rejected: Story = {
  args: {
    status: 'rejected',
    ...defaultHandlers,
  },
};

export const Cancelled: Story = {
  args: {
    status: 'cancelled',
    ...defaultHandlers,
  },
};

export const Closing: Story = {
  args: {
    status: 'closing',
    ...defaultHandlers,
  },
};

export const Closed: Story = {
  args: {
    status: 'closed',
    ...defaultHandlers,
  },
};

export const WithLoading: Story = {
  args: {
    status: 'pending',
    loading: {
      accept: true,
      message: false,
    },
    ...defaultHandlers,
  },
};

export const WithDisabled: Story = {
  args: {
    status: 'pending',
    disabled: {
      accept: true,
      reject: false,
      message: false,
    },
    ...defaultHandlers,
  },
};

export const AllStatusComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <strong>Pending:</strong>
        <ReservationActions status="pending" {...defaultHandlers} />
      </div>
      <div>
        <strong>Accepted:</strong>
        <ReservationActions status="accepted" {...defaultHandlers} />
      </div>
      <div>
        <strong>Rejected:</strong>
        <ReservationActions status="rejected" {...defaultHandlers} />
      </div>
      <div>
        <strong>Cancelled:</strong>
        <ReservationActions status="cancelled" {...defaultHandlers} />
      </div>
      <div>
        <strong>Closing:</strong>
        <ReservationActions status="closing" {...defaultHandlers} />
      </div>
      <div>
        <strong>Closed:</strong>
        <ReservationActions status="closed" {...defaultHandlers} />
      </div>
    </div>
  ),
};