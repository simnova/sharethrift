import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';

// Simple test to verify the file exports correctly
const meta = {
	title: 'Pages/Account/Settings - File Exports',
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: 'Settings page wrapper that renders the SettingsViewContainer.',
			},
		},
	},
  tags: ['!dev'], // functional testing story, not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags

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
	play:  async () => {
		const { Settings } = await import('./Settings.tsx');
		expect(Settings).toBeDefined();
		expect(typeof Settings).toBe('function');
	},
};
