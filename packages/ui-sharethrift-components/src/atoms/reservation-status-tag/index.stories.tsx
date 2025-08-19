import type { Meta, StoryObj } from '@storybook/react';
import { ReservationStatusTag } from './index.js';

const meta: Meta<typeof ReservationStatusTag> = {
  title: 'Atoms/ReservationStatusTag',
  component: ReservationStatusTag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['pending', 'accepted', 'rejected', 'cancelled', 'closing', 'closed'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = {
  args: {
    status: 'pending',
  },
};

export const Accepted: Story = {
  args: {
    status: 'accepted',
  },
};

export const Rejected: Story = {
  args: {
    status: 'rejected',
  },
};

export const Cancelled: Story = {
  args: {
    status: 'cancelled',
  },
};

export const Closing: Story = {
  args: {
    status: 'closing',
  },
};

export const Closed: Story = {
  args: {
    status: 'closed',
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <ReservationStatusTag status="pending" />
      <ReservationStatusTag status="accepted" />
      <ReservationStatusTag status="rejected" />
      <ReservationStatusTag status="cancelled" />
      <ReservationStatusTag status="closing" />
      <ReservationStatusTag status="closed" />
    </div>
  ),
};