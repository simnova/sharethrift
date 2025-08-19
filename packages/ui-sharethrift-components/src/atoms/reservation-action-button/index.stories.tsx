import type { Meta, StoryObj } from '@storybook/react';
import { ReservationActionButton } from './index.js';

const meta: Meta<typeof ReservationActionButton> = {
  title: 'Atoms/ReservationActionButton',
  component: ReservationActionButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    action: {
      control: { type: 'select' },
      options: ['accept', 'reject', 'cancel', 'close', 'message'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'middle', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Accept: Story = {
  args: {
    action: 'accept',
  },
};

export const Reject: Story = {
  args: {
    action: 'reject',
  },
};

export const Cancel: Story = {
  args: {
    action: 'cancel',
  },
};

export const Close: Story = {
  args: {
    action: 'close',
  },
};

export const Message: Story = {
  args: {
    action: 'message',
  },
};

export const Loading: Story = {
  args: {
    action: 'accept',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    action: 'accept',
    disabled: true,
  },
};

export const AllActions: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <ReservationActionButton action="accept" />
      <ReservationActionButton action="reject" />
      <ReservationActionButton action="cancel" />
      <ReservationActionButton action="close" />
      <ReservationActionButton action="message" />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
      <ReservationActionButton action="accept" size="small" />
      <ReservationActionButton action="accept" size="middle" />
      <ReservationActionButton action="accept" size="large" />
    </div>
  ),
};