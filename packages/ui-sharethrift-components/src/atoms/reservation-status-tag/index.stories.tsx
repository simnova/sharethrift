import type { Meta, StoryObj } from '@storybook/react';
import ReservationStatusTag from './index.tsx';

const meta: Meta<typeof ReservationStatusTag> = {
  title: 'Atoms/ReservationStatusTag',
  component: ReservationStatusTag,
  parameters: {
    layout: 'centered',
  },
  args: {
    status: 'REQUESTED',
  },
};

export default meta;
type Story = StoryObj<typeof ReservationStatusTag>;

export const Requested: Story = {
  args: { status: 'REQUESTED' },
};

export const Accepted: Story = {
  args: { status: 'ACCEPTED' },
};

export const Rejected: Story = {
  args: { status: 'REJECTED' },
};

export const Closed: Story = {
  args: { status: 'CLOSED' },
};

export const Cancelled: Story = {
  args: { status: 'CANCELLED' },
};