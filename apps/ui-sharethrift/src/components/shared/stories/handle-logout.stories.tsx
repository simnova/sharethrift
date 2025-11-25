import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { HandleLogout } from '../handle-logout.ts';
import { clearStorage } from '../local-storage.ts';

// Simple component to import the utility
const HandleLogoutTest = () => {
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
		// Verify HandleLogout is a function
		expect(typeof HandleLogout).toBe('function');

		// Test clearStorage (which HandleLogout depends on)
		localStorage.setItem('test-key', 'test-value');
		clearStorage();
		expect(localStorage.getItem('test-key')).toBe(null);

		expect(canvasElement).toBeTruthy();
	},
};
