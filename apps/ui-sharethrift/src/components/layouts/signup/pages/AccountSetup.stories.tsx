import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { AccountSetup } from './AccountSetup.tsx';

const meta: Meta<typeof AccountSetup> = {
	title: 'Pages/Signup/AccountSetup',
	component: AccountSetup,
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
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const emailInput = canvas.getByLabelText('Email');
		await expect(emailInput).toBeInTheDocument();
		
		const usernameInput = canvas.getByLabelText('Username');
		await expect(usernameInput).toBeInTheDocument();
		
		const passwordInput = canvas.getByLabelText('Create Password');
		await expect(passwordInput).toBeInTheDocument();
		
		const confirmInput = canvas.getByLabelText('Confirm Password');
		await expect(confirmInput).toBeInTheDocument();
	},
};

export const WithPrefilledData: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const emailInput = canvas.getByLabelText('Email');
		await userEvent.type(emailInput, 'test@example.com');
		
		const usernameInput = canvas.getByLabelText('Username');
		await userEvent.type(usernameInput, 'testuser');
		
		const passwordInput = canvas.getByLabelText('Create Password');
		await userEvent.type(passwordInput, 'Password123');
		
		const confirmInput = canvas.getByLabelText('Confirm Password');
		await userEvent.type(confirmInput, 'Password123');
		
		await expect(emailInput).toHaveValue('test@example.com');
	},
};

export const PasswordMismatch: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const passwordInput = canvas.getByLabelText('Create Password');
		await userEvent.type(passwordInput, 'Password123');
		
		const confirmInput = canvas.getByLabelText('Confirm Password');
		await userEvent.type(confirmInput, 'DifferentPassword456');
		
		const submitButton = canvas.getByRole('button', { name: /Save and Continue/i });
		await userEvent.click(submitButton);
	},
};

export const SubmitValidForm: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		await userEvent.type(canvas.getByLabelText('Email'), 'test@example.com');
		await userEvent.type(canvas.getByLabelText('Username'), 'testuser123');
		await userEvent.type(canvas.getByLabelText('Create Password'), 'Password123');
		await userEvent.type(canvas.getByLabelText('Confirm Password'), 'Password123');
		
		const submitButton = canvas.getByRole('button', { name: /Save and Continue/i });
		await userEvent.click(submitButton);
	},
};

export const ValidationErrors: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const submitButton = canvas.getByRole('button', { name: /Save and Continue/i });
		await userEvent.click(submitButton);
	},
};
