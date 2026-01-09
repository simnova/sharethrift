import type { Meta, StoryObj } from '@storybook/react';
import { BlockListingModal } from './block-listing-modal';

const meta: Meta<typeof BlockListingModal> = {
	title: 'Layouts/Home/View Listing/Block Listing Modal',
	component: BlockListingModal,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		visible: { control: 'boolean' },
		loading: { control: 'boolean' },
		onConfirm: { action: 'confirmed' },
		onCancel: { action: 'cancelled' },
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		visible: true,
		listingTitle: 'City Bike',
		loading: false,
	},
};

export const Loading: Story = {
	args: {
		visible: true,
		listingTitle: 'City Bike',
		loading: true,
	},
};

export const Closed: Story = {
	args: {
		visible: false,
		listingTitle: 'City Bike',
		loading: false,
	},
};
