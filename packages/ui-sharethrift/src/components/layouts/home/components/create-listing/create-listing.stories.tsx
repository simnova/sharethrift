import type { Meta, StoryObj } from '@storybook/react';
import { CreateListing } from './create-listing';
import { MemoryRouter } from 'react-router-dom';

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
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithImages: Story = {
	args: {
		uploadedImages: [
			'/assets/item-images/bike.png',
			'/assets/item-images/tent.png',
			'/assets/item-images/projector.png',
		],
	},
};
