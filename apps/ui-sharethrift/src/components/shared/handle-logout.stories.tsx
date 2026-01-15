import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { HandleLogout } from './handle-logout.ts';
import { clearStorage } from './local-storage.ts';

const HandleLogoutTest: React.FC = () => {
	return (
		<div style={{ padding: '20px' }}>
			<h2>Handle Logout Utility</h2>
			<p data-testid="fn-type">HandleLogout type: {typeof HandleLogout}</p>
		</div>
	);
};

const meta: Meta<typeof HandleLogoutTest> = {
	title: 'Shared/Utilities/HandleLogout',
	component: HandleLogoutTest,
	parameters: {
		layout: 'centered',
	},
};

export default meta;
type Story = StoryObj<typeof HandleLogoutTest>;

export const Default: Story = {
	play: ({ canvasElement }) => {
		expect(typeof HandleLogout).toBe('function');

		localStorage.setItem('test-key', 'test-value');
		clearStorage();
		expect(localStorage.getItem('test-key')).toBe(null);

		expect(canvasElement).toBeTruthy();
	},
};

export const CallHandleLogout: Story = {
	play: ({ canvasElement }) => {
		localStorage.setItem('test-data', 'value');
		sessionStorage.setItem('test-session', 'session-value');
		
		const mockAuth = {
			removeUser: () => Promise.resolve(),
			signoutRedirect: () => Promise.resolve(),
		};
		
		const mockApolloClient = {
			clearStore: () => Promise.resolve(),
		};
		
		HandleLogout(mockAuth as any, mockApolloClient as any, globalThis.location.origin);
		
		expect(localStorage.getItem('test-data')).toBe(null);
		expect(canvasElement).toBeTruthy();
	},
};
