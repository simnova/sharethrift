import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import '@sthrift/ui-components/src/styles/theme.css';

// Simple test to verify the file exports correctly
const meta = {
	title: 'Pages/Admin/Dashboard',
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: 'Admin dashboard main page with tabs for managing listings and users.',
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
			<p>AdminDashboardMain component file exists and exports correctly</p>
		</div>
	),
	play: async () => {
		const { AdminDashboardMain } = await import('./admin-dashboard-main.tsx');
		expect(AdminDashboardMain).toBeDefined();
		expect(typeof AdminDashboardMain).toBe('function');
	},
};
