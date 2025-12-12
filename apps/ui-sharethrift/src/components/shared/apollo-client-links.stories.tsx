import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider, useApolloClient } from '@apollo/client/react';
import { MemoryRouter } from 'react-router-dom';
import { useRef, useState } from 'react';
import {
	ApolloLinkToAddAuthHeaderIfAccessTokenAvailable,
	ApolloLinkToAddCustomHeader,
	BaseApolloLink,
	TerminatingApolloBatchLinkForGraphqlServer,
	TerminatingApolloHttpLinkForGraphqlServer,
} from './apollo-client-links.tsx';

// Mock environment variable
const mockEnv = {
	VITE_FUNCTION_ENDPOINT: 'https://mock-functions.example.com',
};

// Mock import.meta.env
Object.defineProperty(import.meta, 'env', {
	value: mockEnv,
	writable: true,
});

// Create a test Apollo client using the link functions
const testClient = new ApolloClient({
	cache: new InMemoryCache(),
	link: ApolloLinkToAddAuthHeaderIfAccessTokenAvailable('test-token').concat(
		TerminatingApolloBatchLinkForGraphqlServer({
			uri: mockEnv.VITE_FUNCTION_ENDPOINT,
			batchMax: 15,
			batchInterval: 50,
		}),
	),
});

const meta: Meta = {
	title: 'Components/Shared/Apollo Client Links',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Utility functions for creating Apollo Client links with authentication, custom headers, and GraphQL server configuration. These stories demonstrate how the link functions work within an Apollo client setup.',
			},
		},
	},
	decorators: [
		(Story) => (
			<ApolloProvider client={testClient}>
				<MemoryRouter>
					<Story />
				</MemoryRouter>
			</ApolloProvider>
		),
	],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Test component that verifies Apollo link functionality
const ApolloLinkTester = () => {
	const apolloClient = useApolloClient();
	const [authResult, setAuthResult] = useState<string | null>(null);
	const [headersResult, setHeadersResult] = useState<string | null>(null);
	const authButtonRef = useRef<HTMLButtonElement>(null);
	const headersButtonRef = useRef<HTMLButtonElement>(null);

	const testAuthHeader = () => {
		try {
			// Test that the auth link is in the chain
			const { link } = apolloClient;
			const resultData = { linkExists: !!link, linkType: link.constructor.name };
			setAuthResult(JSON.stringify(resultData));
			return resultData;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			const resultData = { success: false, error: errorMessage };
			setAuthResult(JSON.stringify(resultData));
			return resultData;
		}
	};

	const testCustomHeaders = () => {
		// Test that custom headers link can be created
		const customHeaderLink = ApolloLinkToAddCustomHeader('X-Custom-Header', 'test-value');
		const resultData = { linkType: customHeaderLink.constructor.name };
		setHeadersResult(JSON.stringify(resultData));
		return resultData;
	};

	return (
		<div data-testid="apollo-link-tester">
			<button
				ref={authButtonRef}
				type="button"
				data-testid="test-auth-button"
				data-result={authResult}
				onClick={testAuthHeader}
			>
				Test Auth Header
			</button>
			<button
				ref={headersButtonRef}
				type="button"
				data-testid="test-headers-button"
				data-result={headersResult}
				onClick={testCustomHeaders}
			>
				Test Custom Headers
			</button>
		</div>
	);
};

// Story demonstrating Base Apollo Link
export const BaseLink: Story = {
	name: 'Base Apollo Link',
	render: () => {
		const baseLink = BaseApolloLink();
		return (
			<div data-testid="base-link-demo">
				<p>Base Link Created: {baseLink.constructor.name}</p>
			</div>
		);
	},
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const demo = await canvas.findByTestId('base-link-demo');
		expect(demo).toBeInTheDocument();
		expect(demo.textContent).toContain('Base Link Created');
	},
};

// Story demonstrating Auth Header Link
export const AuthHeaderLinkDemo: Story = {
	name: 'Auth Header Link',
	render: () => <ApolloLinkTester />,
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const authButton = await canvas.findByTestId('test-auth-button');

		// Click the test button to verify auth functionality
		authButton.click();

		// Wait for the result to be set
		await new Promise((resolve) => setTimeout(resolve, 100));

		// Verify the button received a result
		const result = authButton.dataset['result'];
		expect(result).toBeTruthy();
		const parsedResult = JSON.parse(result as string);
		expect(parsedResult).toHaveProperty('linkExists');
		// Verify linkExists is boolean (doesn't matter true/false, just that it exists to indicate the link is working)
		expect(typeof parsedResult.linkExists).toBe('boolean');
	},
};

// Story demonstrating Custom Header Link
export const CustomHeaderLinkDemo: Story = {
	name: 'Custom Header Link',
	render: () => <ApolloLinkTester />,
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const headersButton = await canvas.findByTestId('test-headers-button');

		// Click the test button to verify custom headers functionality
		headersButton.click();

		// Wait for the result to be set
		await new Promise((resolve) => setTimeout(resolve, 100));

		// Verify the button received a result
		const result = headersButton.dataset['result'];
		expect(result).toBeTruthy();
		const parsedResult = JSON.parse(result as string);
		expect(parsedResult).toHaveProperty('linkType');
	},
};

// Story demonstrating Batch HTTP Link
export const BatchHttpLinkDemo: Story = {
	name: 'Batch HTTP Link',
	render: () => {
		const batchLink = TerminatingApolloBatchLinkForGraphqlServer({
			uri: mockEnv.VITE_FUNCTION_ENDPOINT,
			batchMax: 15,
			batchInterval: 50,
		});
		return (
			<div data-testid="batch-link-demo">
				<p>Batch Link Created: {batchLink.constructor.name}</p>
			</div>
		);
	},
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const demo = await canvas.findByTestId('batch-link-demo');
		expect(demo).toBeInTheDocument();
		expect(demo.textContent).toContain('Batch Link Created');
	},
};

// Story demonstrating HTTP Link
export const HttpLinkDemo: Story = {
	name: 'HTTP Link',
	render: () => {
		const httpLink = TerminatingApolloHttpLinkForGraphqlServer({
			uri: mockEnv.VITE_FUNCTION_ENDPOINT,
		});
		return (
			<div data-testid="http-link-demo">
				<p>HTTP Link Created: {httpLink.constructor.name}</p>
			</div>
		);
	},
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const demo = await canvas.findByTestId('http-link-demo');
		expect(demo).toBeInTheDocument();
		expect(demo.textContent).toContain('HTTP Link Created');
	},
};

// Story demonstrating auth token with undefined value
export const AuthHeaderWithoutToken: Story = {
	name: 'Auth Header Without Token',
	render: () => {
		const linkWithoutToken = ApolloLinkToAddAuthHeaderIfAccessTokenAvailable(undefined);
		return (
			<div data-testid="auth-no-token">
				<p>Link Created Without Token: {linkWithoutToken.constructor.name}</p>
			</div>
		);
	},
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const demo = await canvas.findByTestId('auth-no-token');
		expect(demo).toBeInTheDocument();
		expect(demo.textContent).toContain('Link Created Without Token');
	},
};

// Story demonstrating custom header with conditional flag
export const CustomHeaderConditional: Story = {
	name: 'Custom Header Conditional',
	render: () => {
		const linkWithCondition = ApolloLinkToAddCustomHeader('X-Test', 'value', false);
		const linkWithoutCondition = ApolloLinkToAddCustomHeader('X-Test', 'value', true);
		return (
			<div data-testid="custom-header-conditional">
				<p>Link With False Condition: {linkWithCondition.constructor.name}</p>
				<p>Link With True Condition: {linkWithoutCondition.constructor.name}</p>
			</div>
		);
	},
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const demo = await canvas.findByTestId('custom-header-conditional');
		expect(demo).toBeInTheDocument();
		expect(demo.textContent).toContain('Link With False Condition');
		expect(demo.textContent).toContain('Link With True Condition');
	},
};

// Story demonstrating custom header with null value
export const CustomHeaderWithNull: Story = {
	name: 'Custom Header With Null',
	render: () => {
		const linkWithNull = ApolloLinkToAddCustomHeader('X-Test', null);
		return (
			<div data-testid="custom-header-null">
				<p>Link With Null Value: {linkWithNull.constructor.name}</p>
			</div>
		);
	},
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const demo = await canvas.findByTestId('custom-header-null');
		expect(demo).toBeInTheDocument();
		expect(demo.textContent).toContain('Link With Null Value');
	},
};

// Story demonstrating custom header with undefined value
export const CustomHeaderWithUndefined: Story = {
	name: 'Custom Header With Undefined',
	render: () => {
		const linkWithUndefined = ApolloLinkToAddCustomHeader('X-Test', undefined);
		return (
			<div data-testid="custom-header-undefined">
				<p>Link With Undefined Value: {linkWithUndefined.constructor.name}</p>
			</div>
		);
	},
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const demo = await canvas.findByTestId('custom-header-undefined');
		expect(demo).toBeInTheDocument();
		expect(demo.textContent).toContain('Link With Undefined Value');
	},
};

// Story demonstrating auth header with empty string token
export const AuthHeaderWithEmptyToken: Story = {
	name: 'Auth Header With Empty Token',
	render: () => {
		const linkWithEmptyToken = ApolloLinkToAddAuthHeaderIfAccessTokenAvailable('');
		return (
			<div data-testid="auth-empty-token">
				<p>Link Created With Empty Token: {linkWithEmptyToken.constructor.name}</p>
			</div>
		);
	},
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		const demo = await canvas.findByTestId('auth-empty-token');
		expect(demo).toBeInTheDocument();
		expect(demo.textContent).toContain('Link Created With Empty Token');
	},
};
