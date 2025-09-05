import type { Meta, StoryObj } from '@storybook/react';
import { StatusTag } from './index.js';

const meta: Meta<typeof StatusTag> = {
  title: 'Molecules/StatusTag',
  component: StatusTag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: [
        'Active', 'Paused', 'Reserved', 'Expired', 'Draft', 'Blocked',
        'Accepted', 'Rejected', 'Closed', 'Pending', 'Closing'
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Listing status stories
export const Active: Story = {
  args: {
    status: 'Active',
  },
};

export const Paused: Story = {
  args: {
    status: 'Paused',
  },
};

export const Reserved: Story = {
  args: {
    status: 'Reserved',
  },
};

export const Expired: Story = {
  args: {
    status: 'Expired',
  },
};

export const Draft: Story = {
  args: {
    status: 'Draft',
  },
};

export const Blocked: Story = {
  args: {
    status: 'Blocked',
  },
};

// Request status stories
export const Accepted: Story = {
  args: {
    status: 'Accepted',
  },
};

export const Rejected: Story = {
  args: {
    status: 'Rejected',
  },
};

export const Closed: Story = {
  args: {
    status: 'Closed',
  },
};

export const Pending: Story = {
  args: {
    status: 'Pending',
  },
};

export const Closing: Story = {
  args: {
    status: 'Closing',
  },
};

// All statuses together
export const AllListingStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <StatusTag status="Active" />
      <StatusTag status="Paused" />
      <StatusTag status="Reserved" />
      <StatusTag status="Expired" />
      <StatusTag status="Draft" />
      <StatusTag status="Blocked" />
    </div>
  ),
};

export const AllRequestStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <StatusTag status="Accepted" />
      <StatusTag status="Rejected" />
      <StatusTag status="Closed" />
      <StatusTag status="Pending" />
      <StatusTag status="Closing" />
    </div>
  ),
};