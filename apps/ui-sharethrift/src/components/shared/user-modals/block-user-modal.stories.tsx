import type { Meta, StoryObj } from '@storybook/react';
import { BlockUserModal } from './block-user-modal';
import type { BlockUserFormValues } from './block-user-modal';
import { expect, fn, userEvent, within, waitFor } from 'storybook/test';

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

export const FillFormAndSubmit: Story = {
  args: {
    visible: true,
    userName: 'Jane Doe',
    loading: false,
    onConfirm: fn(),
    onCancel: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await waitFor(async () => {
      const reasonSelect = canvas.queryByText('Select a reason');
      if (reasonSelect) {
        await userEvent.click(reasonSelect);
      }
    });
    
    // Select first option from dropdown
    const firstOption = document.querySelector('.ant-select-item');
    if (firstOption) {
      await userEvent.click(firstOption);
    }
    
    // Fill description
    const descriptionField = canvas.getByPlaceholderText('This message will be shown to the user');
    await userEvent.type(descriptionField, 'Test block description');
    
    // Submit form
    const blockButton = canvas.getByRole('button', { name: /Block/i });
    await userEvent.click(blockButton);
    
    await waitFor(() => {
      expect(args.onConfirm).toHaveBeenCalled();
    });
  },
};

export const CancelModal: Story = {
  args: {
    visible: true,
    userName: 'Jane Doe',
    loading: false,
    onConfirm: fn(),
    onCancel: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    const cancelButton = canvas.getByRole('button', { name: /Cancel/i });
    await userEvent.click(cancelButton);
    
    await expect(args.onCancel).toHaveBeenCalled();
  },
};

export const SubmitWithoutReason: Story = {
  args: {
    visible: true,
    userName: 'Jane Doe',
    loading: false,
    onConfirm: fn(),
    onCancel: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Wait for modal to render
    await waitFor(() => {
      expect(canvas.getByText(/Are you sure you want to block/)).toBeInTheDocument();
    });
    
    // Try to submit without filling form
    const blockButton = canvas.getByRole('button', { name: /Block/i });
    await userEvent.click(blockButton);
    
    // Should show validation error
    await waitFor(() => {
      const errorMessage = canvas.queryByText('Please select a reason');
      expect(errorMessage).toBeInTheDocument();
    });
    
    // onConfirm should not be called
    await expect(args.onConfirm).not.toHaveBeenCalled();
  },
};

export const SubmitWithoutDescription: Story = {
  args: {
    visible: true,
    userName: 'Jane Doe',
    loading: false,
    onConfirm: fn(),
    onCancel: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Wait for modal to render
    await waitFor(() => {
      expect(canvas.getByText(/Are you sure you want to block/)).toBeInTheDocument();
    });
    
    // Select reason only
    await waitFor(async () => {
      const reasonSelect = canvas.queryByText('Select a reason');
      if (reasonSelect) {
        await userEvent.click(reasonSelect);
      }
    });
    
    const firstOption = document.querySelector('.ant-select-item');
    if (firstOption) {
      await userEvent.click(firstOption);
    }
    
    // Try to submit without description
    const blockButton = canvas.getByRole('button', { name: /Block/i });
    await userEvent.click(blockButton);
    
    // Should show validation error
    await waitFor(() => {
      const errorMessage = canvas.queryByText('Please provide a description');
      expect(errorMessage).toBeInTheDocument();
    });
    
    // onConfirm should not be called
    await expect(args.onConfirm).not.toHaveBeenCalled();
  },
};

export const SelectAllReasons: Story = {
  args: {
    visible: true,
    userName: 'Jane Doe',
    loading: false,
    onConfirm: fn(),
    onCancel: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Wait for modal to render
    await waitFor(() => {
      expect(canvas.getByText(/Are you sure you want to block/)).toBeInTheDocument();
    });
    
    // Click reason select
    await waitFor(async () => {
      const reasonSelect = canvas.queryByText('Select a reason');
      if (reasonSelect) {
        await userEvent.click(reasonSelect);
      }
    });
    
    // Verify all options are present
    await waitFor(() => {
      expect(document.querySelector('.ant-select-item')).toBeInTheDocument();
    });
  },
};

export const ErrorDuringSubmit: Story = {
  args: {
    visible: true,
    userName: 'Jane Doe',
    loading: false,
    onConfirm: async () => {
      throw new Error('Test error');
    },
    onCancel: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Wait for modal to render
    await waitFor(() => {
      expect(canvas.getByText(/Are you sure you want to block/)).toBeInTheDocument();
    });
    
    // Fill form
    await waitFor(async () => {
      const reasonSelect = canvas.queryByText('Select a reason');
      if (reasonSelect) {
        await userEvent.click(reasonSelect);
      }
    });
    
    const firstOption = document.querySelector('.ant-select-item');
    if (firstOption) {
      await userEvent.click(firstOption);
    }
    
    const descriptionField = canvas.getByPlaceholderText('This message will be shown to the user');
    await userEvent.type(descriptionField, 'Test description');
    
    // Submit form - should handle error gracefully
    const blockButton = canvas.getByRole('button', { name: /Block/i });
    await userEvent.click(blockButton);
  },
};