import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { oidcConfigAdmin } from './oidc-config-admin.tsx';

// Mock environment variables
const mockEnv = {
	VITE_B2C_ADMIN_AUTHORITY: 'https://mock-admin-authority.example.com',
	VITE_B2C_ADMIN_CLIENTID: 'mock-admin-client-id',
	VITE_B2C_ADMIN_REDIRECT_URI: 'https://mock-admin-app.example.com',
	VITE_B2C_ADMIN_SCOPE: 'openid profile admin',
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
	title: 'Config/OIDC Config Admin',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: 'OIDC configuration for admin authentication using Azure B2C.',
			},
		},
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Component to display config values
const ConfigDisplay = () => {
	return (
		<div data-testid="oidc-config-admin-display">
			<h3>OIDC Admin Configuration</h3>
			<dl>
				<dt>Authority:</dt>
				<dd>{oidcConfigAdmin.authority}</dd>
				<dt>Client ID:</dt>
				<dd>{oidcConfigAdmin.client_id}</dd>
				<dt>Redirect URI:</dt>
				<dd>{oidcConfigAdmin.redirect_uri}</dd>
				<dt>Response Type:</dt>
				<dd>{oidcConfigAdmin.response_type}</dd>
				<dt>Code Verifier:</dt>
				<dd>{String(oidcConfigAdmin.code_verifier)}</dd>
				<dt>Scope:</dt>
				<dd>{oidcConfigAdmin.scope}</dd>
			</dl>
		</div>
	);
};

export const ConfigValues: Story = {
	name: 'Config Values',
	render: () => <ConfigDisplay />,
	play: async ({ canvasElement: _canvasElement }: { canvasElement: HTMLElement }) => {
		// Verify config properties exist
		expect(oidcConfigAdmin).toBeDefined();
		expect(oidcConfigAdmin.authority).toBeDefined();
		expect(oidcConfigAdmin.client_id).toBeDefined();
		expect(oidcConfigAdmin.redirect_uri).toBeDefined();
		expect(oidcConfigAdmin.response_type).toBe('code');
		expect(oidcConfigAdmin.code_verifier).toBe(true);
	},
};

export const OnSigninCallback: Story = {
	name: 'onSigninCallback Function',
	render: () => {
		return (
			<div data-testid="oidc-admin-callback-test">
				<p>Testing admin onSigninCallback function</p>
				<p data-testid="callback-exists">
					{typeof oidcConfigAdmin.onSigninCallback === 'function'
						? 'Function exists'
						: 'Function missing'}
				</p>
			</div>
		);
	},
	play: async () => {
		// Verify onSigninCallback exists
		expect(oidcConfigAdmin.onSigninCallback).toBeDefined();
		expect(typeof oidcConfigAdmin.onSigninCallback).toBe('function');
	},
};
