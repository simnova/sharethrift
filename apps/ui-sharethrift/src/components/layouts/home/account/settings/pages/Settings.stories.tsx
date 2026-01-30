import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';

// Simple test to verify the file exports correctly
const meta = {
	title: 'Pages/Account/Settings',
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: 'Settings page wrapper that renders the SettingsViewContainer.',
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
			<p>Settings component file exists and exports correctly</p>
		</div>
	),
	play: async () => {
		const { Settings } = await import('./settings.tsx');
		expect(Settings).toBeDefined();
		expect(typeof Settings).toBe('function');
	},
};
