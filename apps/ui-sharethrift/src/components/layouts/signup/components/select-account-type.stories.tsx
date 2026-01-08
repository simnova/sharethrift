import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, fn, userEvent } from 'storybook/test';
import { SelectAccountType } from './select-account-type.tsx';
import type { AccountPlan } from '../../../../generated.tsx';

const mockAccountPlans: AccountPlan[] = [
	{
		id: '1',
		name: 'non-verified-personal',
		description: 'Non-Verified Personal',
		billingAmount: 0,
		billingPeriodLength: 1,
		billingPeriodUnit: 'month',
		currency: 'USD',
		schemaVersion: '1.0',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		feature: {
			activeReservations: 3,
			bookmarks: 10,
			itemsToShare: 5,
			friends: 50,
		},
	},
	{
		id: '2',
		name: 'verified-personal',
		description: 'Verified Personal',
		billingAmount: 5,
		billingPeriodLength: 1,
		billingPeriodUnit: 'month',
		currency: 'USD',
		schemaVersion: '1.0',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		feature: {
			activeReservations: 10,
			bookmarks: 50,
			itemsToShare: 20,
			friends: 100,
		},
	},
	{
		id: '3',
		name: 'verified-personal-plus',
		description: 'Verified Personal Plus',
		billingAmount: 10,
		billingPeriodLength: 1,
		billingPeriodUnit: 'month',
		currency: 'USD',
		schemaVersion: '1.0',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		feature: {
			activeReservations: 25,
			bookmarks: 100,
			itemsToShare: 50,
			friends: 250,
		},
	},
];

const meta: Meta<typeof SelectAccountType> = {
	title: 'Signup/SelectAccountType',
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
	play:  ({ canvasElement }) => {
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
	play:  ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByText('Account Type and Plan')).toBeTruthy();
	},
};

export const Loading: Story = {
	args: {
		loading: true,
	},
	play:  ({ canvasElement }) => {
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
