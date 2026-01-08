import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { LoginSelection } from '../login-selection.tsx';
import { MockAuthWrapper } from '../../../test-utils/storybook-mock-auth-wrappers.tsx';

const meta: Meta<typeof LoginSelection> = {
	title: 'Shared/LoginSelection',
	component: LoginSelection,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		(Story) => (
			<MockAuthWrapper>
				<MemoryRouter>
					<Story />
				</MemoryRouter>
			</MockAuthWrapper>
		),
	],
};

export default meta;
type Story = StoryObj<typeof LoginSelection>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const emailInput = canvas.getByLabelText('Email');
		await expect(emailInput).toBeInTheDocument();
		
		const passwordInput = canvas.getByLabelText('Password');
		await expect(passwordInput).toBeInTheDocument();
		
		const personalLoginButton = canvas.getByRole('button', { name: /Personal Login/i });
		await expect(personalLoginButton).toBeInTheDocument();
		
		const adminLoginButton = canvas.getByRole('button', { name: /Admin Login/i });
		await expect(adminLoginButton).toBeInTheDocument();
	},
};

export const WithEnvironment: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const signUpButton = canvas.getByRole('button', { name: /Sign Up/i });
		await expect(signUpButton).toBeInTheDocument();
		
		const backLink = canvas.getByRole('button', { name: /Back to Home/i });
		await expect(backLink).toBeInTheDocument();
		
		const forgotLink = canvas.getByRole('button', { name: /Forgot password/i });
		await expect(forgotLink).toBeInTheDocument();
	},
};

export const FillLoginForm: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const emailInput = canvas.getByLabelText('Email');
		await userEvent.type(emailInput, 'test@example.com');
		
		const passwordInput = canvas.getByLabelText('Password');
		await userEvent.type(passwordInput, 'password123');
		
		await expect(emailInput).toHaveValue('test@example.com');
	},
};

export const ClickBackToHome: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const backLink = canvas.getByRole('button', { name: /Back to Home/i });
		await userEvent.click(backLink);
	},
};

export const ClickForgotPassword: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const forgotLink = canvas.getByRole('button', { name: /Forgot password/i });
		await userEvent.click(forgotLink);
	},
};

export const ClickSignUp: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const signUpButton = canvas.getByRole('button', { name: /Sign Up/i });
		await userEvent.click(signUpButton);
	},
};

export const SubmitFormValidation: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const personalLoginButton = canvas.getByRole('button', { name: /Personal Login/i });
		await userEvent.click(personalLoginButton);
		
		await expect(personalLoginButton).toBeInTheDocument();
	},
};

export const ClickAdminLogin: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const adminLoginButton = canvas.getByRole('button', { name: /Admin Login/i });
		await expect(adminLoginButton).toBeInTheDocument();
		await expect(adminLoginButton).toBeEnabled();
	},
};
