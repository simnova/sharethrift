import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { AdminListingOperationsPage } from './admin-listing-operations-page.tsx';
import '@sthrift/ui-shared/src/styles/theme.css';

const meta: Meta<typeof AdminListingOperationsPage> = {
	title: 'Pages/AdminListingOperationsPage',
	component: AdminListingOperationsPage,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: 'Admin listing operations page for managing listings.',
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof AdminListingOperationsPage>;

export const FileExports: Story = {
	name: 'File Exports',
	render: () => (
		<div data-testid="file-export-test">
			<p>AdminListingOperationsPage component file exists and exports correctly</p>
		</div>
	),
	play: async () => {
		const { AdminListingOperationsPage } = await import('./admin-listing-operations-page.tsx');
		expect(AdminListingOperationsPage).toBeDefined();
		expect(typeof AdminListingOperationsPage).toBe('function');
	},
};
