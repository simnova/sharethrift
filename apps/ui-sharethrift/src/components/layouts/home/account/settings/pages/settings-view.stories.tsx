import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, fn } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { SettingsView } from './settings-view';
import type { SettingsUser } from '../components/settings-view.types';

const mockUser: SettingsUser = {
	id: '1',
	firstName: 'John',
	lastName: 'Doe',
	username: 'johndoe',
	email: 'john@example.com',
	createdAt: '2023-01-15',
	accountType: 'verified-personal',
	aboutMe: 'Hello, I am John!',
	location: {
		city: 'San Francisco',
		state: 'CA',
		address1: '123 Main St',
		address2: 'Apt 4',
		country: 'USA',
		zipCode: '94102',
	},
	billing: {
		subscriptionId: 'sub_123',
		cybersourceCustomerId: 'cust_456',
	},
};

const meta: Meta<typeof SettingsView> = {
	title: 'Components/SettingsView',
	component: SettingsView,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		(Story) => (
			<MemoryRouter>
				<Story />
			</MemoryRouter>
		),
	],
	args: {
		user: mockUser,
		onEditSection: fn(),
		onChangePassword: fn(),
		onSaveSection: fn().mockImplementation(async () => {}),
		isSavingSection: false,
	},
};

export default meta;
type Story = StoryObj<typeof SettingsView>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		expect(canvasElement).toBeTruthy();
		const canvas = within(canvasElement);
		expect(canvas.getByText('John')).toBeInTheDocument();
		expect(canvas.getByText('Doe')).toBeInTheDocument();
	},
};

export const EditProfileSection: Story = {
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const editButton = canvas.getByRole('button', { name: /edit profile/i });
		await userEvent.click(editButton);
		const firstNameInput = canvas.getByLabelText(/first name/i);
		expect(firstNameInput).toBeInTheDocument();
		const cancelButton = canvas.getByRole('button', { name: /cancel/i });
		await userEvent.click(cancelButton);
		expect(args.onEditSection).toHaveBeenCalledWith('profile');
	},
};

export const SaveProfileSection: Story = {
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const editButton = canvas.getByRole('button', { name: /edit profile/i });
		await userEvent.click(editButton);
		const saveButton = canvas.getByRole('button', { name: /save/i });
		await userEvent.click(saveButton);
		expect(args.onSaveSection).toHaveBeenCalled();
	},
};

export const EditLocationSection: Story = {
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const editButton = canvas.getByRole('button', { name: /edit location/i });
		await userEvent.click(editButton);
		const cityInput = canvas.getByLabelText(/city/i);
		expect(cityInput).toBeInTheDocument();
		const cancelButton = canvas.getByRole('button', { name: /cancel/i });
		await userEvent.click(cancelButton);
		expect(args.onEditSection).toHaveBeenCalledWith('location');
	},
};

export const SaveLocationSection: Story = {
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const editButton = canvas.getByRole('button', { name: /edit location/i });
		await userEvent.click(editButton);
		const saveButton = canvas.getByRole('button', { name: /save/i });
		await userEvent.click(saveButton);
		expect(args.onSaveSection).toHaveBeenCalled();
	},
};

export const EditPlanSection: Story = {
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const editButton = canvas.getByRole('button', { name: /edit plan/i });
		await userEvent.click(editButton);
		expect(args.onEditSection).toHaveBeenCalledWith('plan');
		const cancelButton = canvas.getByRole('button', { name: /cancel/i });
		await userEvent.click(cancelButton);
	},
};

export const SelectDifferentPlan: Story = {
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const editButton = canvas.getByRole('button', { name: /edit plan/i });
		await userEvent.click(editButton);
		const saveButton = canvas.getByRole('button', { name: /save/i });
		await userEvent.click(saveButton);
		expect(args.onSaveSection).toHaveBeenCalled();
	},
};

export const EditBillingSection: Story = {
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const editButton = canvas.getByRole('button', { name: /edit billing/i });
		await userEvent.click(editButton);
		const subscriptionInput = canvas.getByLabelText(/subscription id/i);
		expect(subscriptionInput).toBeInTheDocument();
		const cancelButton = canvas.getByRole('button', { name: /cancel/i });
		await userEvent.click(cancelButton);
		expect(args.onEditSection).toHaveBeenCalledWith('billing');
	},
};

export const SaveBillingSection: Story = {
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const editButton = canvas.getByRole('button', { name: /edit billing/i });
		await userEvent.click(editButton);
		const saveButton = canvas.getByRole('button', { name: /save/i });
		await userEvent.click(saveButton);
		expect(args.onSaveSection).toHaveBeenCalled();
	},
};

export const EditPasswordSection: Story = {
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const editButton = canvas.getByRole('button', { name: /edit password/i });
		await userEvent.click(editButton);
		const currentPasswordInput = canvas.getByLabelText(/current password/i);
		expect(currentPasswordInput).toBeInTheDocument();
		const cancelButton = canvas.getByRole('button', { name: /cancel/i });
		await userEvent.click(cancelButton);
		expect(args.onEditSection).toHaveBeenCalledWith('password');
	},
};

export const PasswordMismatch: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const editButton = canvas.getByRole('button', { name: /edit password/i });
		await userEvent.click(editButton);
		const currentPasswordInput = canvas.getByLabelText(/current password/i);
		const newPasswordInput = canvas.getByLabelText(/^new password$/i);
		const confirmPasswordInput = canvas.getByLabelText(/confirm new password/i);
		await userEvent.type(currentPasswordInput, 'oldpassword');
		await userEvent.type(newPasswordInput, 'newpassword123');
		await userEvent.type(confirmPasswordInput, 'differentpassword');
		const saveButton = canvas.getByRole('button', { name: /save/i });
		await userEvent.click(saveButton);
		expect(canvasElement).toBeTruthy();
	},
};

export const ClickChangePasswordButton: Story = {
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const changePasswordButton = canvas.getByRole('button', { name: /change password/i });
		await userEvent.click(changePasswordButton);
		expect(args.onChangePassword).toHaveBeenCalled();
	},
};

export const UserWithoutBilling: Story = {
	args: {
		user: {
			...mockUser,
			billing: undefined,
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const notProvidedTexts = canvas.getAllByText('Not provided');
		expect(notProvidedTexts.length).toBeGreaterThan(0);
	},
};

export const MinimalUser: Story = {
	args: {
		user: {
			id: '2',
			firstName: '',
			lastName: '',
			username: 'minimaluser',
			email: 'minimal@example.com',
			createdAt: '2023-01-01',
			accountType: 'non-verified-personal',
			location: {
				city: '',
				state: '',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const notProvidedTexts = canvas.getAllByText('Not provided');
		expect(notProvidedTexts.length).toBeGreaterThan(0);
	},
};

export const SavingState: Story = {
	args: {
		isSavingSection: true,
	},
	play: async ({ canvasElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};
