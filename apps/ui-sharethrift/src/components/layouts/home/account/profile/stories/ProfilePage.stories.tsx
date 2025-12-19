import type { Meta, StoryObj } from '@storybook/react';
import { HomeRoutes } from '../../../index.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../../test-utils/storybook-decorators.tsx';
import {
	HomeAccountProfileViewContainerCurrentUserDocument,
	HomeAccountProfileViewContainerUserListingsDocument,
	UseUserIsAdminDocument,
	type ItemListing,
	type PersonalUser,
} from '../../../../../../generated.tsx';
import { expect, within } from 'storybook/test';

const mockUserSarah: PersonalUser = {
	__typename: 'PersonalUser',
	id: '507f1f77bcf86cd799439099',
	userIsAdmin: false,
	userType: 'personal-user',
	account: {
		__typename: 'PersonalUserAccount',
		accountType: 'verified-personal',

		username: 'sarah_williams',
		email: 'sarah.williams@example.com',
		profile: {
			__typename: 'PersonalUserAccountProfile',
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
	__typename: 'PersonalUser',
	id: '507f1f77bcf86cd799439102',
	userIsAdmin: false,
	userType: 'personal-user',
	account: {
		__typename: 'PersonalUserAccount',
		profile: {
			__typename: 'PersonalUserAccountProfile',
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
		__typename: 'ItemListing',
		id: '64f7a9c2d1e5b97f3c9d0a41',
		title: 'City Bike',
		description:
			'Perfect city bike for commuting and leisure rides around the neighborhood.',
		category: 'Vehicles & Transportation',
		location: 'Philadelphia, PA',
		state: 'Active',
		images: ['/assets/item-images/bike.png'],
		createdAt: '2024-08-01T00:00:00.000Z',
		sharingPeriodStart: '2024-08-11T00:00:00.000Z',
		sharingPeriodEnd: '2024-12-23T00:00:00.000Z',
		updatedAt: '2024-08-15T12:00:00.000Z',
		listingType: 'item-listing',
	},
	{
		__typename: 'ItemListing',
		id: '64f7a9c2d1e5b97f3c9d0a13',
		title: 'Projector',
		description: 'HD projector for movie nights and presentations.',
		category: 'Electronics',
		location: 'Philadelphia, PA',
		state: 'Active',
		images: ['/assets/item-images/projector.png'],
		createdAt: '2024-08-13T00:00:00.000Z',
		sharingPeriodStart: '2024-08-13T00:00:00.000Z',
		sharingPeriodEnd: '2024-12-23T00:00:00.000Z',
		updatedAt: '2024-08-15T12:00:00.000Z',
		listingType: 'item-listing',
	},
];

const meta: Meta<typeof HomeRoutes> = {
	title: 'Pages/Account/Profile',
	component: HomeRoutes,
	decorators: [withMockApolloClient, withMockRouter('/account/profile')],
	parameters: {
		layout: 'fullscreen',
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultView: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('main')).toBeInTheDocument();
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: UseUserIsAdminDocument,
					},
					result: {
						data: {
							currentUser: {
								id: mockUserSarah.id,
								userIsAdmin: false,
								__typename: 'PersonalUser',
							},
						},
					},
				},
				{
					request: {
						query: HomeAccountProfileViewContainerCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockUserSarah,
						},
					},
				},

				{
					request: {
						query: HomeAccountProfileViewContainerUserListingsDocument,
						variables: { page: 1, pageSize: 100 },
					},
					result: {
						data: {
							myListingsAll: {
								__typename: 'PaginatedMyListings',
								items: mockTwoListings,
								total: mockTwoListings.length,
								page: 1,
								pageSize: 100,
							},
						},
					},
				},
			],
		},
	},
};

export const NoListings: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: UseUserIsAdminDocument,
					},
					result: {
						data: {
							currentUser: {
								id: mockUserAlex.id,
								userIsAdmin: false,
								__typename: 'PersonalUser',
							},
						},
					},
				},
				{
					request: {
						query: HomeAccountProfileViewContainerCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockUserAlex,
						},
					},
				},
				{
					request: {
						query: HomeAccountProfileViewContainerUserListingsDocument,
						variables: { page: 1, pageSize: 100 },
					},
					result: {
						data: {
							myListingsAll: {
								__typename: 'PaginatedMyListings',
								items: [],
								total: 0,
								page: 1,
								pageSize: 100,
							},
						},
					},
				},
			],
		},
	},
};
