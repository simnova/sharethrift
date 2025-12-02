import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, fn } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { ProfileView } from './profile-view';
import type { ItemListing } from '../../../../../../generated';

const mockUser = {
	id: '1',
	firstName: 'John',
	lastName: 'Doe',
	username: 'johndoe',
	email: 'john@example.com',
	accountType: 'personal',
	location: {
		city: 'San Francisco',
		state: 'CA',
	},
	createdAt: '2023-01-15',
};

const mockListings: ItemListing[] = [
	{
		id: 'listing-1',
		title: 'Mountain Bike',
		description: 'Great for trails',
		category: 'Sports',
		listingType: 'item-listing',
		location: 'San Francisco, CA',
		sharingPeriodStart: '2024-12-01',
		sharingPeriodEnd: '2024-12-31',
		images: ['/assets/item-images/bike.png'],
		state: 'Published',
		createdAt: '2024-11-01T00:00:00Z',
		__typename: 'ItemListing',
	},
	{
		id: 'listing-2',
		title: 'Camera Equipment',
		description: 'Professional DSLR',
		category: 'Electronics',
		listingType: 'item-listing',
		location: 'San Francisco, CA',
		sharingPeriodStart: '2024-12-05',
		sharingPeriodEnd: '2024-12-20',
		images: ['/assets/item-images/camera.png'],
		state: 'Paused',
		createdAt: '2024-11-15T00:00:00Z',
		__typename: 'ItemListing',
	},
];

const meta: Meta<typeof ProfileView> = {
	title: 'Components/ProfileView',
	component: ProfileView,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		(Story) => (
			<MemoryRouter>
				<Story />
			</MemoryRouter>
		),
	],
};

export default meta;
type Story = StoryObj<typeof ProfileView>;

export const Default: Story = {
	args: {
		user: mockUser,
		listings: [],
		isOwnProfile: true,
		onEditSettings: () => console.log('Edit settings clicked'),
		onListingClick: (_id: string) => console.log('Listing clicked'),
	},
	play: async ({ canvasElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const WithListings: Story = {
	args: {
		user: mockUser,
		listings: mockListings,
		isOwnProfile: true,
		onEditSettings: fn(),
		onListingClick: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText('Mountain Bike')).toBeInTheDocument();
		await expect(canvas.getByText('Camera Equipment')).toBeInTheDocument();
	},
};

export const ClickAccountSettings: Story = {
	args: {
		user: mockUser,
		listings: [],
		isOwnProfile: true,
		onEditSettings: fn(),
		onListingClick: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const settingsButtons = canvas.getAllByRole('button', { name: /Account Settings/i });
		if (settingsButtons[0]) await userEvent.click(settingsButtons[0]);
		await expect(args.onEditSettings).toHaveBeenCalled();
	},
};

export const ViewOtherUserProfile: Story = {
	args: {
		user: mockUser,
		listings: mockListings,
		isOwnProfile: false,
		onEditSettings: fn(),
		onListingClick: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const settingsButtons = canvas.queryAllByRole('button', { name: /Account Settings/i });
		await expect(settingsButtons.length).toBe(0);
	},
};

export const EmptyListingsOwnProfile: Story = {
	args: {
		user: mockUser,
		listings: [],
		isOwnProfile: true,
		onEditSettings: fn(),
		onListingClick: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText('No listings yet')).toBeInTheDocument();
		await expect(canvas.getByRole('button', { name: /Create Your First Listing/i })).toBeInTheDocument();
	},
};

export const EmptyListingsOtherProfile: Story = {
	args: {
		user: mockUser,
		listings: [],
		isOwnProfile: false,
		onEditSettings: fn(),
		onListingClick: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText('No listings yet')).toBeInTheDocument();
		const createButton = canvas.queryByRole('button', { name: /Create Your First Listing/i });
		await expect(createButton).toBeNull();
	},
};

export const ClickListing: Story = {
	args: {
		user: mockUser,
		listings: mockListings,
		isOwnProfile: true,
		onEditSettings: fn(),
		onListingClick: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const listingCard = canvas.getByText('Mountain Bike');
		await userEvent.click(listingCard);
		await expect(args.onListingClick).toHaveBeenCalledWith('listing-1');
	},
};
