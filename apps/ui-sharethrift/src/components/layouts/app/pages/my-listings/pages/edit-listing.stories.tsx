import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { EditListing } from './edit-listing.tsx';

const meta: Meta<typeof EditListing> = {
	title: 'Pages/My Listings/Edit Listing',
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
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: 'Default',
  tags: ['!dev'], // temporarily not rendered in sidebar, will be updated when this component is ready - https://storybook.js.org/docs/writing-stories/tags 
	play:  ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
		const content = canvasElement.textContent;
		expect(content).toContain('Edit Listing Page');
	},
};
