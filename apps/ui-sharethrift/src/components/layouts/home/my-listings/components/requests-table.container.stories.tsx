import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { RequestsTableContainer } from './requests-table.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../test-utils/storybook-decorators.tsx';
import { HomeRequestsTableContainerMyListingsRequestsDocument } from '../../../../../generated.tsx';

const mockRequests = {
	items: [
		{
			__typename: 'MyListingRequest',
			id: '1',
			title: 'Cordless Drill',
			image: '/assets/item-images/projector.png',
			requestedOn: '2025-01-15',
			reservationPeriod: '2025-01-20 - 2025-01-25',
			status: 'Pending',
			requestedBy: 'John Doe',
		},
		{
			__typename: 'MyListingRequest',
			id: '2',
			title: 'Electric Guitar',
			image: '/assets/item-images/projector.png',
			requestedOn: '2025-02-01',
			reservationPeriod: '2025-02-10 - 2025-02-15',
			status: 'Accepted',
			requestedBy: 'Jane Smith',
		},
	],
	total: 2,
};

const meta: Meta<typeof RequestsTableContainer> = {
	title: 'Containers/RequestsTableContainer',
	component: RequestsTableContainer,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeRequestsTableContainerMyListingsRequestsDocument,
						variables: {
							page: 1,
							pageSize: 6,
							searchText: '',
							statusFilters: [],
							sorter: { field: '', order: '' },
							sharerId: '6324a3f1e3e4e1e6a8e1d8b1',
						},
					},
					result: {
						data: {
							myListingsRequests: mockRequests,
						},
					},
				},
			],
		},
	},
	decorators: [withMockApolloClient, withMockRouter('/my-listings/requests')],
};

export default meta;
type Story = StoryObj<typeof RequestsTableContainer>;

export const Default: Story = {
	args: {
		currentPage: 1,
		onPageChange: () => {},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const Empty: Story = {
	args: {
		currentPage: 1,
		onPageChange: () => {},
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeRequestsTableContainerMyListingsRequestsDocument,
						variables: {
							page: 1,
							pageSize: 6,
							searchText: '',
							statusFilters: [],
							sorter: { field: '', order: '' },
							sharerId: '6324a3f1e3e4e1e6a8e1d8b1',
						},
					},
					result: {
						data: {
							myListingsRequests: { items: [], total: 0 },
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
	args: {
		currentPage: 1,
		onPageChange: () => {},
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeRequestsTableContainerMyListingsRequestsDocument,
						variables: {
							page: 1,
							pageSize: 6,
							searchText: '',
							statusFilters: [],
							sorter: { field: '', order: '' },
							sharerId: '6324a3f1e3e4e1e6a8e1d8b1',
						},
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
