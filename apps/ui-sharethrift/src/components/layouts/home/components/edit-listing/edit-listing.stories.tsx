import type { Meta, StoryObj } from '@storybook/react';
import { EditListing } from './edit-listing.tsx';
import { MemoryRouter } from 'react-router-dom';

const mockListing = {
	__typename: 'ItemListing' as const,
	id: '123',
	title: 'City Bike',
	description:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
	category: 'Vehicles & Transportation',
	location: 'Philadelphia, PA 19145',
	sharingPeriodStart: '2020-11-08',
	sharingPeriodEnd: '2020-12-23',
	state: 'Published',
	images: [
		'/assets/item-images/bike.png',
		'/assets/item-images/bike-detail-1.png',
		'/assets/item-images/bike-detail-2.png',
	],
	createdAt: '2020-10-01',
	updatedAt: '2020-10-01',
	sharer: {
		id: 'user123',
	},
};

const meta: Meta<typeof EditListing> = {
	title: 'Components/EditListing',
	component: EditListing,
	decorators: [
		(Story) => (
			<MemoryRouter initialEntries={['/']}>
				<Story />
			</MemoryRouter>
		),
	],
	parameters: {
		layout: 'fullscreen',
	},
	args: {
		listing: mockListing,
		categories: [
			'Electronics',
			'Clothing & Accessories',
			'Home & Garden',
			'Sports & Recreation',
			'Books & Media',
			'Tools & Equipment',
			'Vehicles & Transportation',
			'Musical Instruments',
			'Art & Collectibles',
			'Other',
		],
		isLoading: false,
		onSubmit: () => console.log('Submit'),
		onPause: () => console.log('Pause'),
		onDelete: () => console.log('Delete'),
		onCancel: () => console.log('Cancel'),
		onNavigateBack: () => console.log('Navigate back'),
		uploadedImages: mockListing.images,
		onImageAdd: () => console.log('Add image'),
		onImageRemove: () => console.log('Remove image'),
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
	args: {
		isLoading: true,
	},
};

export const DraftListing: Story = {
	args: {
		listing: {
			...mockListing,
			state: 'Drafted',
		},
	},
};

export const PausedListing: Story = {
	args: {
		listing: {
			...mockListing,
			state: 'Paused',
		},
	},
};

export const CancelledListing: Story = {
	args: {
		listing: {
			...mockListing,
			state: 'Cancelled',
		},
	},
};

export const MinimalImages: Story = {
	args: {
		uploadedImages: ['/assets/item-images/bike.png'],
	},
};
