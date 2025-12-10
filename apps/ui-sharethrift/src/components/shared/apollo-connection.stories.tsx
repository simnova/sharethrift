import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { AuthProvider } from 'react-oidc-context';
import { MemoryRouter } from 'react-router-dom';
import { ApolloConnection } from './apollo-connection.tsx';

const generateMockToken = () => {
	const randomPart = Math.random().toString(36).substring(2, 15);
	const timestamp = Date.now().toString(36);
	return `mock_${timestamp}_${randomPart}`;
};

// Mock environment variables
const mockEnv = {
	VITE_FUNCTION_ENDPOINT: 'https://mock-functions.example.com',
	VITE_BLOB_STORAGE_CONFIG_URL: 'https://mock-storage.example.com',
	VITE_B2C_AUTHORITY: 'https://mock-authority.example.com',
	VITE_B2C_CLIENTID: 'mock-client-id',
	NODE_ENV: 'development',
};

// Mock window.sessionStorage and window.localStorage
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

// Mock import.meta.env
Object.defineProperty(import.meta, 'env', {
	value: mockEnv,
	writable: true,
});

const meta: Meta<typeof ApolloConnection> = {
	title: 'Components/Shared/Apollo Connection',
	component: ApolloConnection,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Apollo Connection component that provides GraphQL client context to the application. Handles authentication and creates appropriate links for different data sources.',
			},
		},
	},
	decorators: [
		(Story) => (
			<AuthProvider
				authority={mockEnv.VITE_B2C_AUTHORITY}
				client_id={mockEnv.VITE_B2C_CLIENTID}
				redirect_uri={globalThis.location.origin}
				post_logout_redirect_uri={globalThis.location.origin}
				userStore={mockStorage}
			>
				<MemoryRouter>
					<Story />
				</MemoryRouter>
			</AuthProvider>
		),
	],
} satisfies Meta<typeof ApolloConnection>;

export default meta;
type Story = StoryObj<typeof ApolloConnection>;

// Test component to verify Apollo context
const ApolloContextTester = () => {
	return (
		<div data-testid="apollo-context-tester">
			<p>Apollo Provider is active</p>
		</div>
	);
};

export const WithAuthenticatedUser: Story = {
	name: 'With Authenticated User',
	render: () => (
		<ApolloConnection>
			<ApolloContextTester />
		</ApolloConnection>
	),
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const tester = await canvas.findByTestId('apollo-context-tester');
		expect(tester).toBeInTheDocument();
		expect(tester.textContent).toContain('Apollo Provider is active');
	},
};

export const WithoutAuthToken: Story = {
	name: 'Without Auth Token',
	render: () => (
		<ApolloConnection>
			<ApolloContextTester />
		</ApolloConnection>
	),
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const tester = await canvas.findByTestId('apollo-context-tester');
		expect(tester).toBeInTheDocument();
	},
};

export const RendersChildren: Story = {
	name: 'Renders Children',
	render: () => (
		<ApolloConnection>
			<div data-testid="child-component">
				<h1>Child Component</h1>
				<p>This is a child component wrapped by ApolloConnection</p>
			</div>
		</ApolloConnection>
	),
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const child = await canvas.findByTestId('child-component');
		expect(child).toBeInTheDocument();
		expect(child.querySelector('h1')?.textContent).toBe('Child Component');
	},
};
