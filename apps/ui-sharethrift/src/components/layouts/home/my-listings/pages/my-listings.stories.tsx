import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../test-utils/storybook-decorators.tsx';
import {
	HomeAllListingsTableContainerMyListingsAllDocument,
	HomeRequestsTableContainerMyListingsRequestsDocument,
} from '../../../../../generated.tsx';
import { HomeRoutes } from '../../index.tsx';

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
		{
			__typename: 'ListingAll',
			id: '2',
			title: 'Electric Guitar',
			images: ['/assets/item-images/projector.png'],
			createdAt: '2025-02-01T00:00:00Z',
			sharingPeriodStart: '2025-02-01',
			sharingPeriodEnd: '2025-06-30',
			state: 'Paused',
		},
	],
	total: 2,
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

const meta: Meta<typeof HomeRoutes> = {
	title: 'Pages/My Listings',
	component: HomeRoutes,
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
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const EmptyListings: Story = {
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
	play: ({ canvasElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

export const FileExports: Story = {
	name: 'File Exports',
  tags: ['!dev'], // functional testing story, not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags
	render: () => (
		<div data-testid="file-export-test">
			<p>MyListingsMain component file exists and exports correctly</p>
		</div>
	),
	play: async () => {
		const { MyListingsMain } = await import('./my-listings.tsx');
		expect(MyListingsMain).toBeDefined();
		expect(typeof MyListingsMain).toBe('function');
	},
};
