import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { oidcConfig } from './oidc-config.tsx';

// Mock environment variables
const mockEnv = {
	VITE_B2C_AUTHORITY: 'https://mock-authority.example.com',
	VITE_B2C_CLIENTID: 'mock-client-id',
	VITE_B2C_REDIRECT_URI: 'https://mock-app.example.com',
	VITE_B2C_SCOPE: 'openid profile',
};

// Mock import.meta.env
Object.defineProperty(import.meta, 'env', {
	value: mockEnv,
	writable: true,
});

// Mock globalThis for onSigninCallback test
const mockSessionStorage = {
	getItem: (_key: string) => null,
	setItem: (_key: string, _value: string) => {},
	removeItem: (_key: string) => {},
	clear: () => {},
	key: () => null,
	length: 0,
};

Object.defineProperty(globalThis, 'sessionStorage', {
	value: mockSessionStorage,
	writable: true,
});

const meta = {
	title: 'Config/OIDC Config',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: 'OIDC configuration for user authentication using Azure B2C.',
			},
		},
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Component to display config values
const ConfigDisplay = () => {
	return (
		<div data-testid="oidc-config-display">
			<h3>OIDC Configuration</h3>
			<dl>
				<dt>Authority:</dt>
				<dd>{oidcConfig.authority}</dd>
				<dt>Client ID:</dt>
				<dd>{oidcConfig.client_id}</dd>
				<dt>Redirect URI:</dt>
				<dd>{oidcConfig.redirect_uri}</dd>
				<dt>Response Type:</dt>
				<dd>{oidcConfig.response_type}</dd>
				<dt>Code Verifier:</dt>
				<dd>{String(oidcConfig.code_verifier)}</dd>
				<dt>Scope:</dt>
				<dd>{oidcConfig.scope}</dd>
			</dl>
		</div>
	);
};

export const ConfigValues: Story = {
	name: 'Config Values',
	render: () => <ConfigDisplay />,
	play: async ({ canvasElement: _canvasElement }: { canvasElement: HTMLElement }) => {
		// Verify config properties exist
		expect(oidcConfig).toBeDefined();
		expect(oidcConfig.authority).toBeDefined();
		expect(oidcConfig.client_id).toBeDefined();
		expect(oidcConfig.redirect_uri).toBeDefined();
		expect(oidcConfig.response_type).toBe('code');
		expect(oidcConfig.code_verifier).toBe(true);
	},
};

export const OnSigninCallback: Story = {
	name: 'onSigninCallback Function',
	render: () => {
		return (
			<div data-testid="oidc-callback-test">
				<p>Testing onSigninCallback function</p>
				<p data-testid="callback-exists">
					{typeof oidcConfig.onSigninCallback === 'function' ? 'Function exists' : 'Function missing'}
				</p>
			</div>
		);
	},
	play: async () => {
		// Verify onSigninCallback exists
		expect(oidcConfig.onSigninCallback).toBeDefined();
		expect(typeof oidcConfig.onSigninCallback).toBe('function');
	},
};
