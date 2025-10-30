import type { Meta, StoryObj } from '@storybook/react';
import { HomeRoutes } from '../../../index.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../../test-utils/storybook-decorators.tsx';
import {
	HomeAccountProfileViewContainerCurrentUserDocument,
	HomeAccountProfileViewContainerUserListingsDocument,
	type ItemListing,
	type PersonalUser,
} from '../../../../../../generated.tsx';

// SHARED MOCK DATA
const mockUserSarah: PersonalUser = {
	id: '507f1f77bcf86cd799439099',
	userType: 'personal',
	account: {
		accountType: 'verified-personal',

		username: 'sarah_williams',
		email: 'sarah.williams@example.com',
		profile: {
			firstName: 'Sarah',
			lastName: 'Williams',
			location: {
				city: 'Philadelphia',
				state: 'PA',
			},
		},
	},

	createdAt: '2024-08-01T00:00:00Z',
	updatedAt: '2024-08-15T12:00:00Z',
};

const mockUserAlex: PersonalUser = {
	id: '507f1f77bcf86cd799439102',
	userType: 'personal',
	account: {
		profile: {
			firstName: 'Alex',
			lastName: '',
			location: {
				city: 'Boston',
				state: 'MA',
			},
		},
		username: 'new_user',
		email: 'new.user@example.com',
		accountType: 'non-verified-personal',
	},
	createdAt: '2025-10-01T08:00:00Z',
	updatedAt: '2025-10-01T08:00:00Z',
};

const mockTwoListings: ItemListing[] = [
	{
		id: '64f7a9c2d1e5b97f3c9d0a41',
		title: 'City Bike',
		description:
			'Perfect city bike for commuting and leisure rides around the neighborhood.',
		category: 'Vehicles & Transportation',
		location: 'Philadelphia, PA',
		state: 'Published',
		images: ['/assets/item-images/bike.png'],
		createdAt: '2024-08-01T00:00:00.000Z',
		sharingPeriodStart: '2024-08-11T00:00:00.000Z',
		sharingPeriodEnd: '2024-12-23T00:00:00.000Z',
		updatedAt: '2024-08-15T12:00:00.000Z',
	},
	{
		id: '64f7a9c2d1e5b97f3c9d0a13',
		title: 'Projector',
		description: 'HD projector for movie nights and presentations.',
		category: 'Electronics',
		location: 'Philadelphia, PA',
		state: 'Published',
		images: ['/assets/item-images/projector.png'],
		createdAt: '2024-08-13T00:00:00.000Z',
		sharingPeriodStart: '2024-08-13T00:00:00.000Z',
		sharingPeriodEnd: '2024-12-23T00:00:00.000Z',
		updatedAt: '2024-08-15T12:00:00.000Z',
	},
];

const meta: Meta<typeof HomeRoutes> = {
	title: 'Pages/Account/Profile',
	component: HomeRoutes,
	decorators: [withMockApolloClient, withMockRouter('/account/profile')],
	parameters: {
		layout: 'fullscreen',
		// Note: Using /account/profile route highlights 'Account' menu item in navigation
		// However, the submenu is not initially expanded due to how the navigation state is currently managed
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultView: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAccountProfileViewContainerCurrentUserDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockUserSarah,
						},
					},
				},

				{
					request: {
						query: HomeAccountProfileViewContainerUserListingsDocument,
					},
					result: {
						data: {
							itemListings: mockTwoListings,
						},
					},
				},
			],
		},
	},
};

// Story: Component with no listings (new user empty state)
export const NoListings: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAccountProfileViewContainerCurrentUserDocument,
					},
					result: {
						data: {
							currentPersonalUserAndCreateIfNotExists: mockUserAlex,
						},
					},
				},
				{
					request: {
						query: HomeAccountProfileViewContainerUserListingsDocument,
					},
					result: {
						data: {
							itemListings: [],
						},
					},
				},
			],
		},
	},
};
