import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { clearStorage } from '../local-storage.ts';

// Simple component to import and use the utility
const LocalStorageTest = () => {
	return (
		<div style={{ padding: '20px' }}>
			<h2>Local Storage Utility</h2>
			<p data-testid="fn-type">clearStorage type: {typeof clearStorage}</p>
		</div>
	);
};

const meta: Meta<typeof LocalStorageTest> = {
	title: 'Shared/Utilities/LocalStorage',
	component: LocalStorageTest,
	parameters: {
		layout: 'centered',
	},
};

export default meta;
type Story = StoryObj<typeof LocalStorageTest>;

export const Default: Story = {
	play: ({ canvasElement }) => {
		// Verify clearStorage is a function
		expect(typeof clearStorage).toBe('function');

		// Test that it clears storage
		localStorage.setItem('test-key', 'test-value');
		clearStorage();
		expect(localStorage.getItem('test-key')).toBe(null);

		expect(canvasElement).toBeTruthy();
	},
};
