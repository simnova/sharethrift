import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from 'storybook/test';
import { MyListingsDashboard } from '../components/my-listings-dashboard.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../test-utils/storybook-decorators.tsx';
import {
	HomeAllListingsTableContainerMyListingsAllDocument,
	HomeRequestsTableContainerMyListingsRequestsDocument,
} from '../../../../../generated.tsx';

const mockListings = {
	__typename: 'MyListingsAllResult',
	items: [
		{
			__typename: 'ListingAll',
			id: '1',
			title: 'Cordless Drill',
			images: ['/assets/item-images/projector.png'],
			createdAt: '2025-01-01T00:00:00Z',
			sharingPeriodStart: '2025-01-01',
			sharingPeriodEnd: '2025-12-31',
			state: 'Active',
		},
	],
	total: 1,
	page: 1,
	pageSize: 6,
};

const mockRequests = {
	__typename: 'MyListingsRequestsResult',
	items: [],
	total: 0,
	page: 1,
	pageSize: 6,
};

const meta: Meta<typeof MyListingsDashboard> = {
	title: 'My Listings/Dashboard',
	component: MyListingsDashboard,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAllListingsTableContainerMyListingsAllDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							myListingsAll: mockListings,
						},
					},
				},
				{
					request: {
						query: HomeRequestsTableContainerMyListingsRequestsDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							myListingsRequests: mockRequests,
						},
					},
				},
			],
		},
	},
	args: {
		onCreateListing: fn(),
		requestsCount: 2,
	},
	decorators: [withMockApolloClient, withMockRouter('/my-listings')],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play:  async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};
