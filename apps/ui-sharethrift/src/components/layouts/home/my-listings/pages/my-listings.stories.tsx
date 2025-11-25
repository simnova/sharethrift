import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';

// Simple test to verify the file exports correctly
const meta = {
	title: 'Pages/MyListings/Main',
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: 'My Listings page wrapper that renders the MyListingsDashboardContainer.',
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
			<p>MyListingsMain component file exists and exports correctly</p>
		</div>
	),
	play: async () => {
		const { MyListingsMain } = await import('./my-listings.tsx');
		expect(MyListingsMain).toBeDefined();
		expect(typeof MyListingsMain).toBe('function');
	},
};
