import type { Meta, StoryObj } from '@storybook/react';
import { CreateListing } from './create-listing.tsx';
import { MemoryRouter } from 'react-router-dom';
import { fn } from 'storybook/test';
const meta: Meta<typeof CreateListing> = {
	title: 'Components/CreateListing',
	component: CreateListing,
	// Provide a Router context for components that call useNavigate
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
		categories: [
			'Electronics',
			'Home & Garden',
			'Kids & Baby',
			'Miscellaneous',
			'Sports & Outdoors',
			'Tools & Equipment',
			'Vehicles & Transportation',
		],
		isLoading: false,
		onSubmit: () => undefined,
		onCancel: () => undefined,
		uploadedImages: [],
		onImageAdd: () => undefined,
		onImageRemove: () => undefined,
		onViewListing: () => undefined,
		onViewDraft: () => undefined,
		onModalClose: () => undefined,
	},
	argTypes: {
		onSubmit: { action: 'submit' },
		onCancel: { action: 'cancel' },
		onImageAdd: { action: 'image added' },
		onImageRemove: { action: 'image removed' },
		onViewListing: { action: 'view listing' },
		onViewDraft: { action: 'view draft' },
		onModalClose: { action: 'modal closed' },
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		onSubmit: fn(),
		onCancel: fn(),
		onImageAdd: fn(),
		onImageRemove: fn(),
	},
};

export const WithImages: Story = {
	args: {
		uploadedImages: [
			'/assets/item-images/bike.png',
			'/assets/item-images/tent.png',
			'/assets/item-images/projector.png',
		],
		onSubmit: fn(),
		onCancel: fn(),
		onImageRemove: fn(),
	},
};

export const FormInteraction: Story = {
	args: {
		onSubmit: fn(),
		onCancel: fn(),
	},
};
