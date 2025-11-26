import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, fn, userEvent } from 'storybook/test';
import { SelectAccountType } from './select-account-type.tsx';

const meta: Meta<typeof SelectAccountType> = {
	title: 'Signup/SelectAccountType',
	component: SelectAccountType,
	parameters: {
		layout: 'fullscreen',
	},
	args: {
		currentUserData: null,
		loadingUser: false,
		handleUpdateAccountType: fn(),
		savingAccountType: false,
	},
};

export default meta;
type Story = StoryObj<typeof SelectAccountType>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByText('Account Type and Plan')).toBeTruthy();
		expect(canvas.getByText('Non-Verified Personal')).toBeTruthy();
		expect(canvas.getByText('Verified Personal')).toBeTruthy();
		expect(canvas.getByText('Verified Personal Plus')).toBeTruthy();
	},
};

export const WithExistingAccountType: Story = {
	args: {
		currentUserData: {
			account: {
				accountType: 'verified-personal',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByText('Account Type and Plan')).toBeTruthy();
	},
};

export const Loading: Story = {
	args: {
		loadingUser: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const saveButton = canvas.getByText('Save and Continue');
		// Button should be disabled when loading
		expect(saveButton.closest('button')?.disabled).toBe(true);
	},
};

export const Saving: Story = {
	args: {
		savingAccountType: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const saveButton = canvas.getByText('Save and Continue');
		// Button should be disabled when saving
		expect(saveButton.closest('button')?.disabled).toBe(true);
	},
};

export const SelectDifferentType: Story = {
	args: {
		handleUpdateAccountType: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		
		// Click on Verified Personal Plus card
		const plusCard = canvas.getByText('Verified Personal Plus');
		await userEvent.click(plusCard);
		
		// Click Save and Continue
		const saveButton = canvas.getByText('Save and Continue');
		await userEvent.click(saveButton);
		
		expect(args.handleUpdateAccountType).toHaveBeenCalled();
	},
};

export const ClickSaveAndContinue: Story = {
	args: {
		handleUpdateAccountType: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const saveButton = canvas.getByText('Save and Continue');
		await userEvent.click(saveButton);
		expect(args.handleUpdateAccountType).toHaveBeenCalledWith('non-verified-personal');
	},
};
