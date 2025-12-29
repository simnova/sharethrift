import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';

const isValidUserId = (userId: string | undefined | null): boolean => {
	if (typeof userId !== 'string') {
		return false;
	}

	return userId.trim().length > 0;
};

const meta: Meta = {
	title: 'Shared/Utils/UserValidation',
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const ValidationDemo: React.FC<{ userId: string | undefined | null; label: string }> = ({ userId, label }) => {
	const isValid = isValidUserId(userId);
	return (
		<div style={{ padding: '10px', margin: '5px', border: '1px solid #ccc' }}>
			<strong>{label}</strong>: <code>{JSON.stringify(userId)}</code>
			<br />
			Result: <span style={{ color: isValid ? 'green' : 'red' }}>{isValid ? 'Valid' : 'Invalid'}</span>
		</div>
	);
};

export const ValidUserIds: Story = {
	render: () => (
		<div>
			<h3>Valid User IDs</h3>
			<ValidationDemo userId="507f1f77bcf86cd799439011" label="Standard MongoDB ObjectId" />
			<ValidationDemo userId="abc123def456" label="Alphanumeric ID" />
			<ValidationDemo userId="user-12345" label="ID with dash" />
		</div>
	),
	play: async () => {
		// Test valid user IDs
		await expect(isValidUserId('507f1f77bcf86cd799439011')).toBe(true);
		await expect(isValidUserId('abc123def456')).toBe(true);
		await expect(isValidUserId('user-12345')).toBe(true);
	},
};

export const InvalidUserIds: Story = {
	render: () => (
		<div>
			<h3>Invalid User IDs</h3>
			<ValidationDemo userId="" label="Empty string" />
			<ValidationDemo userId="   " label="Whitespace only" />
			<ValidationDemo userId={undefined} label="Undefined" />
			<ValidationDemo userId={null} label="Null" />
		</div>
	),
	play: async () => {
		// Test invalid user IDs
		await expect(isValidUserId('')).toBe(false);
		await expect(isValidUserId('   ')).toBe(false);
		await expect(isValidUserId(undefined)).toBe(false);
		await expect(isValidUserId(null)).toBe(false);
	},
};

export const EdgeCases: Story = {
	render: () => (
		<div>
			<h3>Edge Cases</h3>
			<ValidationDemo userId=" validId " label="ID with surrounding whitespace" />
			<ValidationDemo userId="	tabbed	" label="ID with tabs" />
		</div>
	),
	play: async () => {
		// Test edge cases - these should be valid because they have content after trim
		await expect(isValidUserId(' validId ')).toBe(true);
		await expect(isValidUserId('	tabbed	')).toBe(true);
	},
};
