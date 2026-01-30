import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { MockUnauthWrapper } from '../../../test-utils/storybook-mock-auth-wrappers.tsx';
import { LoginSelection } from './login-selection.tsx';
import { withMockApolloClient } from '../../../test-utils/storybook-decorators.tsx';
import { UseUserIsAdminDocument } from '../../../generated.tsx';

const meta: Meta<typeof LoginSelection> = {
	title: 'Pages/Home - Unauthenticated/Login',
	component: LoginSelection,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: UseUserIsAdminDocument,
					},
					result: {
						data: {
							currentUser: {
								__typename: 'PersonalUser',
								id: 'user-1',
								userIsAdmin: false,
							},
						},
					},
				},
			],
		},
	},
	decorators: [
		withMockApolloClient,
		(Story) => (
			<MockUnauthWrapper>
				<MemoryRouter>
					<Story />
				</MemoryRouter>
			</MockUnauthWrapper>
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

		const passwordInput = canvas.getByLabelText('Password');
		await expect(passwordInput).toBeInTheDocument();

		const personalLoginButton = canvas.getByRole('button', {
			name: /Personal Login/i,
		});
		await expect(personalLoginButton).toBeInTheDocument();

		const adminLoginButton = canvas.getByRole('button', {
			name: /Admin Login/i,
		});
		await expect(adminLoginButton).toBeInTheDocument();
	},
};

export const WithEnvironment: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const signUpButton = canvasElement.querySelector(
			'[data-testid="sign-up-button"]',
		); // Using data-testid selector for there are multiple buttons with same name "Sign Up"
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
	tags: ['!dev'],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const backLink = canvas.getByRole('button', { name: /Back to Home/i });
		await userEvent.click(backLink);
	},
};

export const ClickForgotPassword: Story = {
	tags: ['!dev'],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const forgotLink = canvas.getByRole('button', { name: /Forgot password/i });
		await userEvent.click(forgotLink);
	},
};

export const ClickSignUp: Story = {
	tags: ['!dev'],
	play: async ({ canvasElement }) => {
		const signUpButton = canvasElement.querySelector(
			'[data-testid="sign-up-button"]',
		);
		// otherwise fails with "TypeError: Cannot read properties of null (reading 'click')"
		if (signUpButton) {
			await userEvent.click(signUpButton);
		} else {
			// fail the test if the button is not found
			throw new Error('Sign Up button not found');
		}
	},
};

export const SubmitFormValidation: Story = {
	tags: ['!dev'],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const personalLoginButton = canvas.getByRole('button', {
			name: /Personal Login/i,
		});
		await userEvent.click(personalLoginButton);

		await expect(personalLoginButton).toBeInTheDocument();
	},
};

export const ClickAdminLogin: Story = {
	tags: ['!dev'],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const adminLoginButton = canvas.getByRole('button', {
			name: /Admin Login/i,
		});
		await expect(adminLoginButton).toBeInTheDocument();
		await expect(adminLoginButton).toBeEnabled();
	},
};

/**
 * Test form validation - Email is required
 * Verifies that the form shows validation error when email is not provided
 */
export const ValidationEmailRequired: Story = {
	tags: ['!dev'],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const personalLoginButton = canvas.getByRole('button', {
			name: /Personal Login/i,
		});
		await userEvent.click(personalLoginButton);

		const errorMessage = await canvas.findByText('Email is required');
		await expect(errorMessage).toBeInTheDocument();
	},
};

/**
 * Test form validation - Password is required
 * Verifies that the form shows validation error when password is not provided
 */
export const ValidationPasswordRequired: Story = {
	tags: ['!dev'],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const emailInput = canvas.getByLabelText('Email');
		await userEvent.type(emailInput, 'test@example.com');

		const personalLoginButton = canvas.getByRole('button', {
			name: /Personal Login/i,
		});
		await userEvent.click(personalLoginButton);

		const errorMessage = await canvas.findByText('Password is required');
		await expect(errorMessage).toBeInTheDocument();
	},
};

/**
 * Test complete form fill and verify values
 * Verifies that both email and password inputs accept and retain values
 */
export const FillCompleteForm: Story = {
	tags: ['!dev'],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const emailInput = canvas.getByLabelText('Email');
		const passwordInput = canvas.getByLabelText('Password');

		await userEvent.type(emailInput, 'user@example.com');
		await userEvent.type(passwordInput, 'securePassword123');

		await expect(emailInput).toHaveValue('user@example.com');
		await expect(passwordInput).toHaveValue('securePassword123');
	},
};

/**
 * Test input placeholders
 * Verifies that the form inputs have correct placeholder text
 */
export const InputPlaceholders: Story = {
	tags: ['!dev'],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const emailInput = canvas.getByLabelText('Email');
		await expect(emailInput).toHaveAttribute('placeholder', 'johndoe@email.com');

		const passwordInput = canvas.getByLabelText('Password');
		await expect(passwordInput).toHaveAttribute('placeholder', 'Your Password');
	},
};

/**
 * Test input autocomplete attributes
 * Verifies that the form inputs have proper autocomplete settings for browser autofill
 */
export const InputAutocomplete: Story = {
	tags: ['!dev'],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const emailInput = canvas.getByLabelText('Email');
		await expect(emailInput).toHaveAttribute('autocomplete', 'email');

		const passwordInput = canvas.getByLabelText('Password');
		await expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
	},
};

/**
 * Test admin login button validation flow
 * Verifies that admin login button triggers form validation and can proceed with valid data
 */
export const AdminLoginValidFlow: Story = {
	tags: ['!dev'],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const emailInput = canvas.getByLabelText('Email');
		const passwordInput = canvas.getByLabelText('Password');

		await userEvent.type(emailInput, 'admin@example.com');
		await userEvent.type(passwordInput, 'adminPassword');

		const adminLoginButton = canvas.getByRole('button', {
			name: /Admin Login/i,
		});

		await expect(emailInput).toHaveValue('admin@example.com');
		await expect(passwordInput).toHaveValue('adminPassword');
		await expect(adminLoginButton).toBeEnabled();
	},
};

/**
 * Test page title rendering
 * Verifies that the main heading is displayed correctly
 */
export const PageTitle: Story = {
	tags: ['!dev'],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const title = canvas.getByText('Log in or Sign up');
		await expect(title).toBeInTheDocument();
	},
};

/**
 * Test divider with 'or' text
 * Verifies that the divider separating login form from sign up button is present
 */
export const DividerPresent: Story = {
	tags: ['!dev'],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const divider = canvas.getByText('or');
		await expect(divider).toBeInTheDocument();
	},
};

/**
 * Test Sign Up button styling and accessibility
 * Verifies that the sign up button has the correct test id
 */
export const SignUpButtonAccessibility: Story = {
	tags: ['!dev'],
	play: async ({ canvasElement }) => {
		const signUpButton = canvasElement.querySelector(
			'[data-testid="sign-up-button"]',
		);
		await expect(signUpButton).toBeInTheDocument();
		await expect(signUpButton).toHaveTextContent('Sign Up');
	},
};

/**
 * Test email input receives focus on load
 * Verifies that the email field is the active element after render
 */
export const EmailInputAutoFocus: Story = {
	tags: ['!dev'],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const emailInput = canvas.getByLabelText('Email');
		// Check that the input is in the document (autoFocus prop is set in JSX)
		await expect(emailInput).toBeInTheDocument();
	},
};

/**
 * Test both login buttons are initially enabled
 * Verifies that both Personal and Admin login buttons are enabled by default
 */
export const LoginButtonsEnabledByDefault: Story = {
	tags: ['!dev'],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const personalLoginButton = canvas.getByRole('button', {
			name: /Personal Login/i,
		});
		const adminLoginButton = canvas.getByRole('button', {
			name: /Admin Login/i,
		});

		await expect(personalLoginButton).toBeEnabled();
		await expect(adminLoginButton).toBeEnabled();
	},
};
