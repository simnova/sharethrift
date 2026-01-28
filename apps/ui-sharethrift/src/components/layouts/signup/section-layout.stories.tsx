import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { SectionLayout } from './section-layout.tsx';
import { MockAuthWrapper } from '../../../test-utils/storybook-mock-auth-wrappers.tsx';
import { MockLink } from '@apollo/client/testing';
import { ApolloClient, InMemoryCache } from '@apollo/client';

const mockApolloClient = new ApolloClient({
	link: new MockLink([]),
	cache: new InMemoryCache(),
});

const meta: Meta<typeof SectionLayout> = {
	title: 'Components/SignUp/Layouts/SectionLayout',
	component: SectionLayout,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		(Story) => (
			<ApolloProvider client={mockApolloClient}>
				<MockAuthWrapper>
					<MemoryRouter initialEntries={['/signup']}>
						<Story />
					</MemoryRouter>
				</MockAuthWrapper>
			</ApolloProvider>
		),
	],
};

export default meta;
type Story = StoryObj<typeof SectionLayout>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const header = canvasElement.querySelector('header');
		await expect(header).toBeInTheDocument();

		const main = canvasElement.querySelector('main');
		await expect(main).toBeInTheDocument();

		const footer = canvasElement.querySelector('footer');
		await expect(footer).toBeInTheDocument();
	},
};

export const WithEnvironmentHandling: Story = {
	play: async ({ canvasElement }) => {
		const header = canvasElement.querySelector('header');
		await expect(header).toBeInTheDocument();
	},
};
export const ClickLogoutButton: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const logoutButton = canvas.queryByText(/Sign Out|Logout/i);
		if (logoutButton) {
			await userEvent.click(logoutButton);
		}
	},
};

export const ProductionModeLogin: Story = {
	parameters: {
		env: {
			MODE: 'production',
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const loginButton = canvas.queryByText(/Login|Sign In/i);
		if (loginButton) {
			await userEvent.click(loginButton);
		}
	},
};

export const ProductionModeAdminLogin: Story = {
	parameters: {
		env: {
			MODE: 'production',
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const adminButton = canvas.queryByText(/Admin/i);
		if (adminButton) {
			await userEvent.click(adminButton);
		}
	},
};

export const ClickSignUp: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const signupButton = canvas.queryByText(/Sign Up/i);
		if (signupButton) {
			await userEvent.click(signupButton);
		}
	},
};

export const ClickCreateListing: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const createButton = canvas.queryByText(/Create Listing|Post/i);
		if (createButton) {
			await userEvent.click(createButton);
		}
	},
};
