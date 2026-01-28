import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../test-utils/storybook-decorators.tsx';
import {
	SharerInformationContainerDocument,
	ViewListingDocument,
	ViewListingCurrentUserDocument,
	ViewListingActiveReservationRequestForListingDocument,
	ViewListingQueryActiveByListingIdDocument,
} from '../../../../generated.tsx';
import { HomeRoutes } from '../index.tsx';
import { userIsAdminMockRequest } from '../../../../test-utils/storybook-helpers.ts';

const mockListing = {
	__typename: 'ItemListing',
	id: '1',
	title: 'Cordless Drill',
	description: 'High-quality cordless drill for home projects',
	category: 'Tools & Equipment',
	location: 'Toronto, ON',
	state: 'Active',
	images: ['/assets/item-images/projector.png'],
	sharingPeriodStart: '2025-01-01',
	sharingPeriodEnd: '2025-12-31',
	createdAt: '2025-01-01T00:00:00Z',
	updatedAt: '2025-01-01T00:00:00Z',
	sharer: {
		__typename: 'PersonalUser',
		id: 'user-1',
		profile: {
			firstName: 'John',
			lastName: 'Doe',
		},
	},
	listingType: 'ItemListing',
	reports: [],
	sharingHistory: [],
	schemaVersion: '1.0.0',
};

const mockCurrentUser = {
	__typename: 'PersonalUser',
	userType: 'personal-user',
	id: 'user-1',
};

const meta: Meta<typeof HomeRoutes> = {
	title: 'Pages/View Listing',
	component: HomeRoutes,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: ViewListingDocument,
						variables: { id: '1' },
					},
					result: {
						data: {
							itemListing: mockListing,
						},
					},
				},
				{
					request: {
						query: ViewListingCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: ViewListingActiveReservationRequestForListingDocument,
						variables: { listingId: '1', reserverId: 'user-1' },
					},
					result: {
						data: {
							myActiveReservationForListing: null,
						},
					},
				},
				{
					request: {
						query: ViewListingQueryActiveByListingIdDocument,
						variables: { listingId: '1' },
					},
					result: {
						data: {
							queryActiveByListingId: [],
						},
					},
				},
				userIsAdminMockRequest('user-1', false),
				{
					request: {
						query: SharerInformationContainerDocument,
						variables: { sharerId: 'user-1' },
					},
					result: {
						data: {
							userById: {
								userIsAdmin: false,
								userType: 'personal-user',
								createdAt: '2025-10-01T08:00:00Z',

								account: {
									__typename: 'PersonalUserAccount',
									username: 'new_user',
									email: 'new.user@example.com',
									accountType: 'non-verified-personal',
									profile: {
										__typename: 'PersonalUserAccountProfile',
										firstName: 'Alex',
										lastName: '',
										location: {
											__typename: 'PersonalUserAccountProfileLocation',
											city: 'Boston',
											state: 'MA',
										},
									},
								},
							},
						},
					},
				},
			],
		},
	},
	decorators: [withMockApolloClient, withMockRouter('/listing/1')],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const Loading: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				userIsAdminMockRequest('user-1', false),
				{
					request: {
						query: ViewListingCurrentUserDocument,
					},
					result: {
						data: {
							currentUser: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: ViewListingDocument,
						variables: { id: '1' },
					},
					delay: Infinity,
				},
        {
					request: {
						query: ViewListingActiveReservationRequestForListingDocument,
						variables: { listingId: '1', reserverId: 'user-1' },
					},
					result: {
						data: {
							myActiveReservationForListing: null,
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};
