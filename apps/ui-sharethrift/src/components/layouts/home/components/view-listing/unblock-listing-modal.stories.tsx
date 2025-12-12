import type { Meta, StoryObj } from '@storybook/react';
import { UnblockListingModal } from './unblock-listing-modal';

const meta: Meta<typeof UnblockListingModal> = {
	title: 'Layouts/Home/View Listing/Unblock Listing Modal',
	component: UnblockListingModal,
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
		listingSharer: 'Patrick G.',
		loading: false,
	},
};

export const WithBlockInfo: Story = {
	args: {
		visible: true,
		listingTitle: 'City Bike',
		listingSharer: 'Patrick G.',
		blockReason: 'Profanity',
		blockDescription:
			'Your listing has been blocked due to profanity in the description. In order to have your listing unblocked, please update your listing to comply with our guidelines and submit an appeal.',
		loading: false,
	},
};

export const Loading: Story = {
	args: {
		visible: true,
		listingTitle: 'City Bike',
		listingSharer: 'Patrick G.',
		loading: true,
	},
};

export const Closed: Story = {
	args: {
		visible: false,
		listingTitle: 'City Bike',
		listingSharer: 'Patrick G.',
		loading: false,
	},
};
