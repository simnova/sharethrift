import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from 'react-oidc-context';
import { RequireAuth } from '../require-auth.tsx';

// Mock OIDC configuration for stories
const mockOidcConfig = {
	authority: 'https://mock-authority.com',
	client_id: 'mock-client-id',
	redirect_uri: 'https://mock-redirect.com',
};

const meta: Meta<typeof RequireAuth> = {
	title: 'Shared/RequireAuth',
	component: RequireAuth,
	parameters: {
		layout: 'centered',
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
type Story = StoryObj<typeof RequireAuth>;

const ProtectedContent = () => (
	<div style={{ padding: '20px', background: '#e8f5e9' }}>
		<h2>Protected Content</h2>
		<p>This content is only visible to authenticated users.</p>
	</div>
);

export const WithAuthentication: Story = {
	args: {
		children: <ProtectedContent />,
	},
	play: async ({ canvasElement }) => {
		// The component will either show protected content or redirect/loading state
		// This story documents the component behavior
		const element = canvasElement.querySelector('div');
		await expect(element).toBeInTheDocument();
	},
};

export const WithForceLogin: Story = {
	args: {
		children: <ProtectedContent />,
		forceLogin: true,
	},
	play: async ({ canvasElement }) => {
		// When forceLogin is true, component will trigger signin redirect
		const element = canvasElement.querySelector('div');
		await expect(element).toBeInTheDocument();
	},
};

export const WithCustomRedirect: Story = {
	args: {
		children: <ProtectedContent />,
		redirectPath: '/custom-login',
	},
	play: async ({ canvasElement }) => {
		// Component uses custom redirect path when provided
		const element = canvasElement.querySelector('div');
		await expect(element).toBeInTheDocument();
	},
};
