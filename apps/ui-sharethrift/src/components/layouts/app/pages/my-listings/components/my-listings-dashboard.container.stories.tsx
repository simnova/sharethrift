import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { MyListingsDashboardContainer } from './my-listings-dashboard.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../../test-utils/storybook-decorators.tsx';
import {
	HomeAllListingsTableContainerMyListingsAllDocument,
	HomeRequestsTableContainerMyListingsRequestsDocument,
} from '../../../../../../generated.tsx';

const mockListings = {
	__typename: 'MyListingsAllResult',
	items: [
		{
			__typename: 'MyListingSummary',
			id: '1',
			title: 'Cordless Drill',
			image: '/assets/item-images/projector.png',
			createdAt: '2025-01-01',
			reservationPeriod: '2025-01-01 - 2025-12-31',
			status: 'Active',
			pendingRequestsCount: 2,
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

const meta: Meta<typeof MyListingsDashboardContainer> = {
	title: 'Containers/MyListingsDashboardContainer',
	tags: ['!dev'], // functional testing story, not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags. These are all functional testing stories.

	component: MyListingsDashboardContainer,
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
	decorators: [withMockApolloClient, withMockRouter('/my-listings')],
};

export default meta;
type Story = StoryObj<typeof MyListingsDashboardContainer>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const Empty: Story = {
	parameters: {
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
							myListingsAll: {
								__typename: 'MyListingsAllResult',
								items: [],
								total: 0,
								page: 1,
								pageSize: 6,
							},
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
							myListingsRequests: {
								__typename: 'MyListingsRequestsResult',
								items: [],
								total: 0,
								page: 1,
								pageSize: 6,
							},
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

export const Loading: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeAllListingsTableContainerMyListingsAllDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					delay: Infinity,
				},
				{
					request: {
						query: HomeRequestsTableContainerMyListingsRequestsDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					delay: Infinity,
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};
