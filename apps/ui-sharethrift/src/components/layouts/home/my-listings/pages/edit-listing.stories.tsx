import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { EditListing } from './edit-listing.tsx';

const meta: Meta<typeof EditListing> = {
	title: 'Pages/MyListings/EditListing',
	component: EditListing,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: 'Edit Listing page placeholder component.',
			},
		},
	},
} satisfies Meta<typeof EditListing>;

export default meta;
type Story = StoryObj<typeof EditListing>;

export const Default: Story = {
	name: 'Default',
	play:  ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
		const content = canvasElement.textContent;
		expect(content).toContain('Edit Listing Page');
	},
};
