import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { ViewListing } from './view-listing-page.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../test-utils/storybook-decorators.tsx';
import {
	ViewListingDocument,
	ViewListingCurrentUserDocument,
	ViewListingActiveReservationRequestForListingDocument,
} from '../../../../generated.tsx';

const mockListing = {
	__typename: 'ItemListing',
	id: '1',
	title: 'Cordless Drill',
	description: 'High-quality cordless drill for home projects',
	category: 'Tools & Equipment',
	location: 'Toronto, ON',
	state: 'Published',
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
};

const mockCurrentUser = {
	__typename: 'PersonalUser',
	id: 'user-2',
};

const meta: Meta<typeof ViewListing> = {
	title: 'Pages/ViewListingPage',
	component: ViewListing,
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
						variables: { listingId: '1', reserverId: 'user-2' },
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
	decorators: [withMockApolloClient, withMockRouter('/listing/1')],
};

export default meta;
type Story = StoryObj<typeof ViewListing>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const Loading: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: ViewListingDocument,
						variables: { id: '1' },
					},
					delay: Infinity,
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};
