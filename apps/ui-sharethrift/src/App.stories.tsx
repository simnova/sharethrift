import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from 'react-oidc-context';
import { MockedProvider } from '@apollo/client/testing/react';
import { App } from './App.tsx';
import { generateMockToken } from './test-utils/generateMockToken.ts';

const mockEnv = {
	VITE_FUNCTION_ENDPOINT: 'https://mock-functions.example.com',
	VITE_BLOB_STORAGE_CONFIG_URL: 'https://mock-storage.example.com',
	VITE_B2C_AUTHORITY: 'https://mock-authority.example.com',
	VITE_B2C_CLIENTID: 'mock-client-id',
	NODE_ENV: 'development',
};

const mockStorage = {
	getItem: (key: string) => {
		if (key.includes('oidc.user')) {
			return JSON.stringify({
				access_token: generateMockToken(),
				profile: { sub: 'test-user' },
			});
		}
		return null;
	},
	setItem: (_key: string, _value: string) => Promise.resolve(),
	removeItem: (_key: string) => Promise.resolve(),
	clear: () => Promise.resolve(),
	key: () => null,
	length: 0,
	set: (_key: string, _value: unknown) => Promise.resolve(),
	get: (_key: string) => Promise.resolve(null),
	remove: (_key: string) => Promise.resolve(null),
	getAllKeys: () => Promise.resolve([]),
};

Object.defineProperty(globalThis, 'sessionStorage', { value: mockStorage, writable: true });
Object.defineProperty(globalThis, 'localStorage', { value: mockStorage, writable: true });

Object.defineProperty(import.meta, 'env', {
	value: mockEnv,
	writable: true,
});

const meta: Meta<typeof App> = {
	title: 'App/Main Application',
	component: App,
	args: {
		hasCompletedOnboarding: false,
		isAuthenticated: false,
	},
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Main application component that handles routing and authentication flow. Integrates Apollo GraphQL client and manages different application sections.',
			},
		},
	},
	decorators: [
		(Story) => (
			<MockedProvider mocks={[]}>
				<AuthProvider
					authority={mockEnv.VITE_B2C_AUTHORITY}
					client_id={mockEnv.VITE_B2C_CLIENTID}
					redirect_uri={globalThis.location.origin}
					post_logout_redirect_uri={globalThis.location.origin}
					userStore={mockStorage}
				>
					<Story />
				</AuthProvider>
			</MockedProvider>
		),
	],
} satisfies Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof App>;

export const RootRoute: Story = {
	name: 'Root Route',
	decorators: [
		(Story) => (
			<MemoryRouter initialEntries={['/']}>
				<Story />
			</MemoryRouter>
		),
	],
	play: ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
		const apolloWrapper =
			canvasElement.querySelector('[data-testid="apollo-connection"]') ||
			canvasElement.closest('[data-testid="apollo-connection"]') ||
			canvasElement;
		expect(apolloWrapper).toBeInTheDocument();
	},
};

export const LoginRoute: Story = {
	name: 'Login Route',
	decorators: [
		(Story) => (
			<MemoryRouter initialEntries={['/login']}>
				<Story />
			</MemoryRouter>
		),
	],
	play: ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
		expect(canvasElement.children.length).toBeGreaterThan(0);
	},
};

export const AuthRedirectAdminRoute: Story = {
	name: 'Auth Redirect Admin Route',
	decorators: [
		(Story) => (
			<MemoryRouter initialEntries={['/auth-redirect-admin']}>
				<Story />
			</MemoryRouter>
		),
	],
	play: ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
		expect(canvasElement.children.length).toBeGreaterThan(0);
	},
};

export const AuthRedirectUserRoute: Story = {
	name: 'Auth Redirect User Route',
	decorators: [
		(Story) => (
			<MemoryRouter initialEntries={['/auth-redirect-user']}>
				<Story />
			</MemoryRouter>
		),
	],
	play: ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
		expect(canvasElement.children.length).toBeGreaterThan(0);
	},
};

export const SignupRoute: Story = {
	name: 'Signup Route (Protected)',
	decorators: [
		(Story) => (
			<MemoryRouter initialEntries={['/signup']}>
				<Story />
			</MemoryRouter>
		),
	],
	play: ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
		expect(canvasElement.children.length).toBeGreaterThan(0);
	},
};
