import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { clearStorage } from '../local-storage.ts';

const LocalStorageTest: React.FC = () => {
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

export const ClearsBothStorages: Story = {
	play: ({ canvasElement }) => {
		localStorage.setItem('local-item', 'local-value');
		sessionStorage.setItem('session-item', 'session-value');
		
		clearStorage();
		
		expect(localStorage.getItem('local-item')).toBe(null);
		expect(sessionStorage.getItem('session-item')).toBe(null);
		expect(canvasElement).toBeTruthy();
	},
};

export const HandlesErrorGracefully: Story = {
	play: ({ canvasElement }) => {
		clearStorage();
		
		expect(canvasElement).toBeTruthy();
	},
};

export const MultipleClears: Story = {
	play: ({ canvasElement }) => {
		localStorage.setItem('key1', 'value1');
		localStorage.setItem('key2', 'value2');
		sessionStorage.setItem('skey1', 'svalue1');
		sessionStorage.setItem('skey2', 'svalue2');
		
		clearStorage();
		
		expect(localStorage.getItem('key1')).toBe(null);
		expect(localStorage.getItem('key2')).toBe(null);
		expect(sessionStorage.getItem('skey1')).toBe(null);
		expect(sessionStorage.getItem('skey2')).toBe(null);
		expect(canvasElement).toBeTruthy();
	},
};
