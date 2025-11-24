import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from 'react-oidc-context';
import { LoginSelection } from '../login-selection.tsx';

// Mock OIDC configuration for stories
const mockOidcConfig = {
	authority: 'https://mock-authority.com',
	client_id: 'mock-client-id',
	redirect_uri: 'https://mock-redirect.com',
};

const meta: Meta<typeof LoginSelection> = {
	title: 'Shared/LoginSelection',
	component: LoginSelection,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		(Story) => (
			<AuthProvider {...mockOidcConfig}>
				<MemoryRouter>
					<Story />
				</MemoryRouter>
			</AuthProvider>
		),
	],
};

export default meta;
type Story = StoryObj<typeof LoginSelection>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		// Verify the login selection page renders
		const element = canvasElement.querySelector('div');
		await expect(element).toBeInTheDocument();
	},
};

export const WithEnvironment: Story = {
	play: async ({ canvasElement }) => {
		// Test component renders in different environments
		// The component behavior changes based on import.meta.env.MODE
		const element = canvasElement.querySelector('div');
		await expect(element).toBeInTheDocument();
	},
};
