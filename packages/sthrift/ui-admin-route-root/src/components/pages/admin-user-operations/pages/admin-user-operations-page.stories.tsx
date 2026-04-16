import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { AdminUserOperationsPage } from './admin-user-operations-page.tsx';
import '@sthrift/ui-shared/src/styles/theme.css';

const meta: Meta<typeof AdminUserOperationsPage> = {
	title: 'Pages/AdminUserOperationsPage',
	component: AdminUserOperationsPage,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: 'Admin user operations page for managing platform users.',
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof AdminUserOperationsPage>;

export const FileExports: Story = {
	name: 'File Exports',
	render: () => (
		<div data-testid="file-export-test">
			<p>AdminUserOperationsPage component file exists and exports correctly</p>
		</div>
	),
	play: async () => {
		const { AdminUserOperationsPage } = await import('./admin-user-operations-page.tsx');
		expect(AdminUserOperationsPage).toBeDefined();
		expect(typeof AdminUserOperationsPage).toBe('function');
	},
};
