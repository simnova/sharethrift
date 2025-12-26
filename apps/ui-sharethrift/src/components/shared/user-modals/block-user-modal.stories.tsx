import type { Meta, StoryObj } from '@storybook/react';
import { BlockUserModal } from './block-user-modal';
import type { BlockUserFormValues } from './block-user-modal';

const meta: Meta<typeof BlockUserModal> = {
  title: 'Shared/User Modals/BlockUserModal',
  component: BlockUserModal,
  argTypes: {
    onConfirm: { action: 'confirm' },
    onCancel: { action: 'cancel' },
  },
};

export default meta;

type Story = StoryObj<typeof BlockUserModal>;

export const Default: Story = {
  args: {
    visible: true,
    userName: 'Jane Doe',
    loading: false,
    onConfirm: (values: BlockUserFormValues) => {
      console.log('confirm', values);
    },
    onCancel: () => {
      console.log('cancel');
    },
  },
};

export const Loading: Story = {
  args: {
    visible: true,
    userName: 'Jane Doe',
    loading: true,
    onConfirm: () => {},
    onCancel: () => {},
  },
};

export const Hidden: Story = {
  args: {
    visible: false,
    userName: 'Jane Doe',
    loading: false,
    onConfirm: () => {},
    onCancel: () => {},
  },
};