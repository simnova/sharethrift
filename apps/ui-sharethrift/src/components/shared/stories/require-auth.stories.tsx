import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from 'react-oidc-context';
import { RequireAuth } from '../require-auth.tsx';
import { createMockAuth, createMockUser } from '../../../test/utils/mockAuth.ts';

const meta: Meta<typeof RequireAuth> = {
	title: 'Shared/RequireAuth',
	component: RequireAuth,
	parameters: {
		layout: 'centered',
	},
  tags: ['!dev'], // not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags

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
	decorators: [
		(Story) => {
			const mockAuth = createMockAuth({
				isAuthenticated: true,
				isLoading: false,
				user: createMockUser(),
			});
			return (
				<AuthContext.Provider value={mockAuth}>
					<MemoryRouter>
						<Story />
					</MemoryRouter>
				</AuthContext.Provider>
			);
		},
	],
	play: async ({ canvasElement }) => {
		const heading = canvasElement.querySelector('h2');
		await expect(heading).toBeTruthy();
	},
};

export const WithForceLogin: Story = {
	args: {
		children: <ProtectedContent />,
		forceLogin: true,
	},
	decorators: [
		(Story) => {
			const mockAuth = createMockAuth({
				isAuthenticated: true,
				isLoading: false,
				user: createMockUser(),
			});
			return (
				<AuthContext.Provider value={mockAuth}>
					<MemoryRouter>
						<Story />
					</MemoryRouter>
				</AuthContext.Provider>
			);
		},
	],
	play: async ({ canvasElement }) => {
		const heading = canvasElement.querySelector('h2');
		await expect(heading).toBeTruthy();
	},
};

export const WithCustomRedirect: Story = {
	args: {
		children: <ProtectedContent />,
		redirectPath: '/custom-login',
	},
	decorators: [
		(Story) => {
			const mockAuth = createMockAuth({
				isAuthenticated: true,
				isLoading: false,
				user: createMockUser(),
			});
			return (
				<AuthContext.Provider value={mockAuth}>
					<MemoryRouter>
						<Story />
					</MemoryRouter>
				</AuthContext.Provider>
			);
		},
	],
	play: async ({ canvasElement }) => {
		const heading = canvasElement.querySelector('h2');
		await expect(heading).toBeTruthy();
	},
};

export const LoadingState: Story = {
	args: {
		children: <ProtectedContent />,
	},
	decorators: [
		(Story) => {
			const mockAuth = createMockAuth({
				isAuthenticated: false,
				isLoading: true,
				user: undefined,
			});
			return (
				<AuthContext.Provider value={mockAuth}>
					<MemoryRouter>
						<Story />
					</MemoryRouter>
				</AuthContext.Provider>
			);
		},
	],
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const ErrorState: Story = {
	args: {
		children: <ProtectedContent />,
	},
	decorators: [
		(Story) => {
			const mockAuth = createMockAuth({
				isAuthenticated: false,
				isLoading: false,
				user: undefined,
			});
			return (
				<AuthContext.Provider value={mockAuth}>
					<MemoryRouter>
						<Story />
					</MemoryRouter>
				</AuthContext.Provider>
			);
		},
	],
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const UnauthenticatedNoForceLogin: Story = {
	args: {
		children: <ProtectedContent />,
		forceLogin: false,
	},
	decorators: [
		(Story) => {
			const mockAuth = createMockAuth({
				isAuthenticated: false,
				isLoading: false,
				user: undefined,
			});
			return (
				<AuthContext.Provider value={mockAuth}>
					<MemoryRouter>
						<Story />
					</MemoryRouter>
				</AuthContext.Provider>
			);
		},
	],
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};
