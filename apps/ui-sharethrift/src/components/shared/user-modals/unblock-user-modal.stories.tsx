import type { Meta, StoryObj } from '@storybook/react';
import { UnblockUserModal } from './unblock-user-modal';

const meta: Meta<typeof UnblockUserModal> = {
  title: 'Shared/User Modals/UnblockUserModal',
  component: UnblockUserModal,
  argTypes: {
    onConfirm: { action: 'confirm' },
    onCancel: { action: 'cancel' },
  },
};

export default meta;

type Story = StoryObj<typeof UnblockUserModal>;

export const Default: Story = {
  args: {
    visible: true,
    userName: 'John Smith',
    loading: false,
    onConfirm: () => {},
    onCancel: () => {},
  },
};


export const Loading: Story = {
  args: {
    visible: true,
    userName: 'John Smith',
    loading: true,
    onConfirm: () => {},
    onCancel: () => {},
  },
};

export const Hidden: Story = {
  args: {
    visible: false,
    userName: 'John Smith',
    blockReason: 'Inappropriate Behavior',
    loading: false,
    onConfirm: () => {},
    onCancel: () => {},
  },
};