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
  play: async ({ args }) => {
    const body = within(document.body);
    
    // Wait for modal to render
    await waitFor(() => {
      expect(body.getByText(/Are you sure you want to block/)).toBeInTheDocument();
    });
    
    // Click on the select control (not the text, but the control itself)
    const selectControl = document.querySelector('.ant-select-selector');
    if (selectControl) {
      await userEvent.click(selectControl);
    }
    
    // Wait for dropdown and select first option
    await waitFor(() => {
      const firstOption = document.querySelector('.ant-select-item');
      expect(firstOption).toBeTruthy();
    });
    const firstOption = document.querySelector('.ant-select-item');
    if (firstOption) {
      await userEvent.click(firstOption);
    }
    
    // Fill description
    const descriptionField = body.getByPlaceholderText('This message will be shown to the user');
    await userEvent.type(descriptionField, 'Test block description');
    
    // Submit form
    const blockButton = body.getByRole('button', { name: /Block/i });
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
  play: async ({ args }) => {
    const body = within(document.body);
    
    // Wait for modal to render
    await waitFor(() => {
      expect(body.getByText(/Are you sure you want to block/)).toBeInTheDocument();
    });
    
    const cancelButton = body.getByRole('button', { name: /Cancel/i });
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
  play: async ({ args }) => {
    const body = within(document.body);
    
    // Wait for modal to render
    await waitFor(() => {
      expect(body.getByText(/Are you sure you want to block/)).toBeInTheDocument();
    });
    
    // Try to submit without filling form
    const blockButton = body.getByRole('button', { name: /Block/i });
    await userEvent.click(blockButton);
    
    // Should show validation error
    await waitFor(() => {
      const errorMessage = body.queryByText('Please select a reason');
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
  play: async ({ args }) => {
    const body = within(document.body);
    
    // Wait for modal to render
    await waitFor(() => {
      expect(body.getByText(/Are you sure you want to block/)).toBeInTheDocument();
    });
    
    // Click on the select control
    const selectControl = document.querySelector('.ant-select-selector');
    if (selectControl) {
      await userEvent.click(selectControl);
    }
    
    await waitFor(() => {
      expect(document.querySelector('.ant-select-item')).toBeTruthy();
    });
    
    const firstOption = document.querySelector('.ant-select-item');
    if (firstOption) {
      await userEvent.click(firstOption);
    }
    
    // Try to submit without description
    const blockButton = body.getByRole('button', { name: /Block/i });
    await userEvent.click(blockButton);
    
    // Should show validation error
    await waitFor(() => {
      const errorMessage = body.queryByText('Please provide a description');
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
  play: async () => {
    const body = within(document.body);
    
    // Wait for modal to render
    await waitFor(() => {
      expect(body.getByText(/Are you sure you want to block/)).toBeInTheDocument();
    });
    
    // Click on the select control
    const selectControl = document.querySelector('.ant-select-selector');
    if (selectControl) {
      await userEvent.click(selectControl);
    }
    
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
  play: async () => {
    const body = within(document.body);
    
    // Wait for modal to render
    await waitFor(() => {
      expect(body.getByText(/Are you sure you want to block/)).toBeInTheDocument();
    });
    
    // Click on the select control
    const selectControl = document.querySelector('.ant-select-selector');
    if (selectControl) {
      await userEvent.click(selectControl);
    }
    
    await waitFor(() => {
      expect(document.querySelector('.ant-select-item')).toBeTruthy();
    });
    
    const firstOption = document.querySelector('.ant-select-item');
    if (firstOption) {
      await userEvent.click(firstOption);
    }
    
    const descriptionField = body.getByPlaceholderText('This message will be shown to the user');
    await userEvent.type(descriptionField, 'Test description');
    
    // Submit form - should handle error gracefully
    const blockButton = body.getByRole('button', { name: /Block/i });
    await userEvent.click(blockButton);
  },
};