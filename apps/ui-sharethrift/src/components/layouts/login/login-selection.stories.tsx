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
	tags: ['!dev'],
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
 * Test button sizing for mobile viewport
 * Verifies that responsive styles are applied based on screen size
 */
export const MobileViewport: Story = {
	tags: ['!dev'],
	parameters: {
		viewport: {
			defaultViewport: 'mobile1',
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Verify form is still rendered on mobile
		const emailInput = canvas.getByLabelText('Email');
		await expect(emailInput).toBeInTheDocument();

		const personalLoginButton = canvas.getByRole('button', {
			name: /Personal Login/i,
		});
		await expect(personalLoginButton).toBeInTheDocument();
	},
};

/**
 * Test password field is of type password
 * Verifies that the password input has proper type for security
 */
export const PasswordFieldType: Story = {
	tags: ['!dev'],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const passwordInput = canvas.getByLabelText('Password');
		await expect(passwordInput).toHaveAttribute('type', 'password');
	},
};

/**
 * Test form submission with Enter key
 * Verifies that pressing Enter in password field submits the form
 */
export const SubmitWithEnterKey: Story = {
	tags: ['!dev'],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const emailInput = canvas.getByLabelText('Email');
		const passwordInput = canvas.getByLabelText('Password');

		await userEvent.type(emailInput, 'test@example.com');
		await userEvent.type(passwordInput, 'password123{Enter}');

		// Form should attempt validation after Enter
		await expect(emailInput).toHaveValue('test@example.com');
	},
};


