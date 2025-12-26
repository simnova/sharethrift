import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import '@sthrift/ui-components/src/styles/theme.css';

// Simple test to verify the file exports correctly
const meta = {
	title: 'Pages/Home/Account/Profile/UserProfile',
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: 'User profile page within the account section of the home layout.',
			},
		},
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const FileExports: Story = {
	name: 'File Exports',
	render: () => (
		<div data-testid="file-export-test">
			<p>UserProfile component file exists and exports correctly</p>
		</div>
	),
	play: async () => {
		const { UserProfile } = await import('./UserProfile.tsx');
		expect(UserProfile).toBeDefined();
		expect(typeof UserProfile).toBe('function');
	},
};
