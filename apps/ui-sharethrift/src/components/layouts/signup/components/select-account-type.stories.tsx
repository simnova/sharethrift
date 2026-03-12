import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { mockAccountPlans } from '../../../../test-utils/storybook-mock-helpers.ts';
import { SelectAccountType } from './select-account-type.tsx';

const meta: Meta<typeof SelectAccountType> = {
	title: 'Components/Signup/SelectAccountType',
	component: SelectAccountType,
	parameters: {
		layout: 'fullscreen',
	},
	args: {
		currentUserData: undefined,
		loading: false,
		onSaveAndContinue: fn(),
		accountPlans: mockAccountPlans,
	},
};

export default meta;
type Story = StoryObj<typeof SelectAccountType>;

export const Default: Story = {
	play: ({ canvasElement }) => {
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
			id: 'user-123',
			account: {
				accountType: 'verified-personal',
			},
		} as Parameters<typeof SelectAccountType>[0]['currentUserData'],
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByText('Account Type and Plan')).toBeTruthy();
	},
};

export const Loading: Story = {
	args: {
		loading: true,
	},
	play: ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const saveButton = canvas.getByText('Save and Continue');
		// Button should have loading state (ant-btn-loading class)
		const button = saveButton.closest('button');
		expect(button).toBeTruthy();
		// When Ant Design Button has loading=true, it adds ant-btn-loading class
		expect(button?.classList.contains('ant-btn-loading')).toBe(true);
	},
};

export const SelectDifferentType: Story = {
	args: {
		onSaveAndContinue: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		// Click on Verified Personal Plus card
		const plusCard = canvas.getByText('Verified Personal Plus');
		await userEvent.click(plusCard);

		// Click Save and Continue
		const saveButton = canvas.getByText('Save and Continue');
		await userEvent.click(saveButton);

		expect(args.onSaveAndContinue).toHaveBeenCalled();
	},
};

export const ClickSaveAndContinue: Story = {
	args: {
		onSaveAndContinue: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const saveButton = canvas.getByText('Save and Continue');
		await userEvent.click(saveButton);
		expect(args.onSaveAndContinue).toHaveBeenCalled();
	},
};
