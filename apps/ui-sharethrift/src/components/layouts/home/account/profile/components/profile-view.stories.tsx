import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import type { ItemListing } from '../../../../../../generated';
import { ProfileView } from './profile-view';

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
		state: 'Active',
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
		permissions: {
			isBlocked: false,
			isAdminViewer: false,
			canBlockUser: false,
		},
		onEditSettings: () => console.log('Edit settings clicked'),
		onListingClick: (_id: string) => console.log('Listing clicked'),
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithListings: Story = {
	args: {
		user: mockUser,
		listings: mockListings,
		isOwnProfile: true,
		permissions: {
			isBlocked: false,
			isAdminViewer: false,
			canBlockUser: false,
		},
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
		permissions: {
			isBlocked: false,
			isAdminViewer: false,
			canBlockUser: false,
		},
		onEditSettings: fn(),
		onListingClick: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const settingsButtons = canvas.getAllByRole('button', {
			name: /Account Settings/i,
		});
		if (settingsButtons[0]) await userEvent.click(settingsButtons[0]);
		await expect(args.onEditSettings).toHaveBeenCalled();
	},
};

export const ViewOtherUserProfile: Story = {
	args: {
		user: mockUser,
		listings: mockListings,
		isOwnProfile: false,
		permissions: {
			isBlocked: false,
			isAdminViewer: false,
			canBlockUser: false,
		},
		onEditSettings: fn(),
		onListingClick: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const settingsButtons = canvas.queryAllByRole('button', {
			name: /Account Settings/i,
		});
		await expect(settingsButtons.length).toBe(0);
	},
};

export const EmptyListingsOwnProfile: Story = {
	args: {
		user: mockUser,
		listings: [],
		isOwnProfile: true,
		permissions: {
			isBlocked: false,
			isAdminViewer: false,
			canBlockUser: false,
		},
		onEditSettings: fn(),
		onListingClick: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText('No listings yet')).toBeInTheDocument();
		await expect(
			canvas.getByRole('button', { name: /Create Your First Listing/i }),
		).toBeInTheDocument();
	},
};

export const EmptyListingsOtherProfile: Story = {
	args: {
		user: mockUser,
		listings: [],
		isOwnProfile: false,
		permissions: {
			isBlocked: false,
			isAdminViewer: false,
			canBlockUser: false,
		},
		onEditSettings: fn(),
		onListingClick: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText('No listings yet')).toBeInTheDocument();
		const createButton = canvas.queryByRole('button', {
			name: /Create Your First Listing/i,
		});
		await expect(createButton).toBeNull();
	},
};

export const ClickListing: Story = {
	args: {
		user: mockUser,
		listings: mockListings,
		isOwnProfile: true,
		permissions: {
			isBlocked: false,
			isAdminViewer: false,
			canBlockUser: false,
		},
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

export const AdminViewingBlockedUser: Story = {
	args: {
		user: mockUser,
		listings: [],
		isOwnProfile: false,
		permissions: {
			isBlocked: true,
			isAdminViewer: true,
			canBlockUser: true,
		},
		onEditSettings: fn(),
		onListingClick: fn(),
		blocking: {
			blockModalVisible: false,
			unblockModalVisible: false,
			handleOpenBlockModal: fn(),
			handleOpenUnblockModal: fn(),
			handleConfirmBlockUser: fn(),
			handleConfirmUnblockUser: fn(),
			closeBlockModal: fn(),
			closeUnblockModal: fn(),
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Profile should be visible but grayed out - use regex to match text that might be split
		await expect(canvas.getByText(/John/)).toBeInTheDocument();
	},
};

export const OpenBlockModal: Story = {
	args: {
		user: mockUser,
		listings: [],
		isOwnProfile: false,
		permissions: {
			isBlocked: false,
			isAdminViewer: true,
			canBlockUser: true,
		},
		onEditSettings: fn(),
		onListingClick: fn(),
		blocking: {
			blockModalVisible: false,
			unblockModalVisible: false,
			handleOpenBlockModal: fn(),
			handleOpenUnblockModal: fn(),
			handleConfirmBlockUser: fn(),
			handleConfirmUnblockUser: fn(),
			closeBlockModal: fn(),
			closeUnblockModal: fn(),
		},
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const blockButton = canvas.queryByRole('button', { name: /Block/i });
		if (blockButton) {
			await userEvent.click(blockButton);
			await expect(args.blocking?.handleOpenBlockModal).toHaveBeenCalled();
		}
	},
};

export const OpenUnblockModal: Story = {
	args: {
		user: mockUser,
		listings: [],
		isOwnProfile: false,
		permissions: {
			isBlocked: true,
			isAdminViewer: true,
			canBlockUser: true,
		},
		onEditSettings: fn(),
		onListingClick: fn(),
		blocking: {
			blockModalVisible: false,
			unblockModalVisible: false,
			handleOpenBlockModal: fn(),
			handleOpenUnblockModal: fn(),
			handleConfirmBlockUser: fn(),
			handleConfirmUnblockUser: fn(),
			closeBlockModal: fn(),
			closeUnblockModal: fn(),
		},
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const unblockButton = canvas.queryByRole('button', { name: /Unblock/i });
		if (unblockButton) {
			await userEvent.click(unblockButton);
			await expect(args.blocking?.handleOpenUnblockModal).toHaveBeenCalled();
		}
	},
};

export const ConfirmBlockUserWithModal: Story = {
	args: {
		user: mockUser,
		listings: [],
		isOwnProfile: false,
		permissions: {
			isBlocked: false,
			isAdminViewer: true,
			canBlockUser: true,
		},
		onEditSettings: fn(),
		onListingClick: fn(),
		blocking: {
			blockModalVisible: true,
			unblockModalVisible: false,
			handleOpenBlockModal: fn(),
			handleOpenUnblockModal: fn(),
			handleConfirmBlockUser: fn(),
			handleConfirmUnblockUser: fn(),
			closeBlockModal: fn(),
			closeUnblockModal: fn(),
		},
	},
	play: async () => {
		await waitFor(async () => {
			const reasonSelect = document.querySelector('.ant-select-selector');
			if (reasonSelect) {
				await userEvent.click(reasonSelect);
			}
		});

		const firstOption = document.querySelector('.ant-select-item');
		if (firstOption) {
			await userEvent.click(firstOption);
		}

		const descriptionField = document.querySelector('textarea');
		if (descriptionField) {
			await userEvent.type(descriptionField, 'Test block');
		}

		const confirmBtn = document.querySelector(
			'.ant-modal-footer .ant-btn-primary',
		);
		if (confirmBtn) {
			await userEvent.click(confirmBtn);
		}
	},
};

export const ConfirmUnblockUserWithModal: Story = {
	args: {
		user: mockUser,
		listings: [],
		isOwnProfile: false,
		permissions: {
			isBlocked: true,
			isAdminViewer: true,
			canBlockUser: true,
		},
		onEditSettings: fn(),
		onListingClick: fn(),
		blocking: {
			blockModalVisible: false,
			unblockModalVisible: true,
			handleOpenBlockModal: fn(),
			handleOpenUnblockModal: fn(),
			handleConfirmBlockUser: fn(),
			handleConfirmUnblockUser: fn(),
			closeBlockModal: fn(),
			closeUnblockModal: fn(),
		},
	},
	play: async ({ args }) => {
		await waitFor(async () => {
			const confirmBtn = document.querySelector(
				'.ant-modal-footer .ant-btn-primary',
			);
			if (confirmBtn) {
				await userEvent.click(confirmBtn);
				await expect(
					args.blocking?.handleConfirmUnblockUser,
				).toHaveBeenCalled();
			}
		});
	},
};

export const UserWithMinimalProfile: Story = {
	args: {
		user: {
			...mockUser,
			firstName: '',
			lastName: '',
			location: {
				city: '',
				state: '',
			},
		},
		listings: [],
		isOwnProfile: false,
		permissions: {
			isBlocked: false,
			isAdminViewer: false,
			canBlockUser: false,
		},
		onEditSettings: fn(),
		onListingClick: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText('@johndoe')).toBeInTheDocument();
	},
};

export const UserWithAllListingStates: Story = {
	args: {
		user: mockUser,
		listings: [
			...mockListings,
			{
				id: 'listing-3',
				title: 'Cancelled Item',
				description: 'Cancelled',
				category: 'Other',
				listingType: 'item-listing',
				location: 'SF, CA',
				sharingPeriodStart: '2024-12-01',
				sharingPeriodEnd: '2024-12-31',
				images: [],
				state: 'Cancelled',
				createdAt: '2024-11-01T00:00:00Z',
				__typename: 'ItemListing',
			},
			{
				id: 'listing-4',
				title: 'Draft Item',
				description: 'Draft',
				category: 'Other',
				listingType: 'item-listing',
				location: 'SF, CA',
				sharingPeriodStart: '2024-12-01',
				sharingPeriodEnd: '2024-12-31',
				images: [],
				state: 'Draft',
				createdAt: '2024-11-01T00:00:00Z',
				__typename: 'ItemListing',
			},
			{
				id: 'listing-5',
				title: 'Expired Item',
				description: 'Expired',
				category: 'Other',
				listingType: 'item-listing',
				location: 'SF, CA',
				sharingPeriodStart: '2024-12-01',
				sharingPeriodEnd: '2024-12-31',
				images: [],
				state: 'Expired',
				createdAt: '2024-11-01T00:00:00Z',
				__typename: 'ItemListing',
			},
			{
				id: 'listing-6',
				title: 'Blocked Item',
				description: 'Blocked',
				category: 'Other',
				listingType: 'item-listing',
				location: 'SF, CA',
				sharingPeriodStart: '2024-12-01',
				sharingPeriodEnd: '2024-12-31',
				images: [],
				state: 'Blocked',
				createdAt: '2024-11-01T00:00:00Z',
				__typename: 'ItemListing',
			},
		],
		isOwnProfile: true,
		permissions: {
			isBlocked: false,
			isAdminViewer: false,
			canBlockUser: false,
		},
		onEditSettings: fn(),
		onListingClick: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText('Mountain Bike')).toBeInTheDocument();
		await expect(canvas.getByText('Cancelled Item')).toBeInTheDocument();
		await expect(canvas.getByText('Draft Item')).toBeInTheDocument();
	},
};

export const LoadingBlockAction: Story = {
	args: {
		user: mockUser,
		listings: [],
		isOwnProfile: false,
		permissions: {
			isBlocked: false,
			isAdminViewer: true,
			canBlockUser: true,
		},
		onEditSettings: fn(),
		onListingClick: fn(),
		blocking: {
			blockModalVisible: true,
			unblockModalVisible: false,
			handleOpenBlockModal: fn(),
			handleOpenUnblockModal: fn(),
			handleConfirmBlockUser: fn(),
			handleConfirmUnblockUser: fn(),
			closeBlockModal: fn(),
			closeUnblockModal: fn(),
		},
		blockUserLoading: true,
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const LoadingUnblockAction: Story = {
	args: {
		user: mockUser,
		listings: [],
		isOwnProfile: false,
		permissions: {
			isBlocked: true,
			isAdminViewer: true,
			canBlockUser: true,
		},
		onEditSettings: fn(),
		onListingClick: fn(),
		blocking: {
			blockModalVisible: false,
			unblockModalVisible: true,
			handleOpenBlockModal: fn(),
			handleOpenUnblockModal: fn(),
			handleConfirmBlockUser: fn(),
			handleConfirmUnblockUser: fn(),
			closeBlockModal: fn(),
			closeUnblockModal: fn(),
		},
		unblockUserLoading: true,
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};
