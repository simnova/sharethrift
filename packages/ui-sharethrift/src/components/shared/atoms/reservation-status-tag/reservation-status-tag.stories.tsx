import type { Meta, StoryObj } from '@storybook/react';
import { ReservationStatusTag } from './reservation-status-tag';

const meta: Meta<typeof ReservationStatusTag> = {
  title: 'Atoms/ReservationStatusTag',
  component: ReservationStatusTag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['REQUESTED', 'ACCEPTED', 'REJECTED', 'RESERVATION_PERIOD', 'CANCELLED'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Requested: Story = {
  args: {
    status: 'REQUESTED',
  },
};

export const Accepted: Story = {
  args: {
    status: 'ACCEPTED',
  },
};

export const Rejected: Story = {
  args: {
    status: 'REJECTED',
  },
};

export const Cancelled: Story = {
  args: {
    status: 'CANCELLED',
  },
};

export const Closed: Story = {
  args: {
    status: 'RESERVATION_PERIOD',
  },
};