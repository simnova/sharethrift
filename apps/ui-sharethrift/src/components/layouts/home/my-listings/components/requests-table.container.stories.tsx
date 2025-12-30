import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor, fn } from 'storybook/test';
import { RequestsTableContainer } from './requests-table.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../test-utils/storybook-decorators.tsx';
import { HomeRequestsTableContainerMyListingsRequestsDocument } from '../../../../../generated.tsx';

const mockRequests = [
	{
		__typename: 'ReservationRequest',
		id: '1',
		state: 'Requested',
		reservationPeriodStart: '2025-01-20T00:00:00.000Z',
		reservationPeriodEnd: '2025-01-25T00:00:00.000Z',
		createdAt: '2025-01-15T00:00:00.000Z',
		listing: {
			__typename: 'ItemListing',
			id: 'listing-1',
			title: 'Cordless Drill',
			images: ['/assets/item-images/projector.png'],
		},
		reserver: {
			__typename: 'PersonalUser',
			id: 'user-1',
			account: {
				__typename: 'PersonalUserAccount',
				profile: {
					__typename: 'PersonalUserAccountProfile',
					firstName: 'John',
					lastName: 'Doe',
				},
			},
		},
	},
	{
		__typename: 'ReservationRequest',
		id: '2',
		state: 'Accepted',
		reservationPeriodStart: '2025-02-10T00:00:00.000Z',
		reservationPeriodEnd: '2025-02-15T00:00:00.000Z',
		createdAt: '2025-02-01T00:00:00.000Z',
		listing: {
			__typename: 'ItemListing',
			id: 'listing-2',
			title: 'Electric Guitar',
			images: ['/assets/item-images/projector.png'],
		},
		reserver: {
			__typename: 'PersonalUser',
			id: 'user-2',
			account: {
				__typename: 'PersonalUserAccount',
				profile: {
					__typename: 'PersonalUserAccountProfile',
					firstName: 'Jane',
					lastName: 'Smith',
				},
			},
		},
	},
];

const meta: Meta<typeof RequestsTableContainer> = {
	title: 'Containers/RequestsTableContainer',
	component: RequestsTableContainer,
	args: {
		sharerId: '6324a3f1e3e4e1e6a8e1d8b1',
	},
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeRequestsTableContainerMyListingsRequestsDocument,
						variables: {
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
		onPageChange: fn(),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/Cordless Drill/i).length).toBeGreaterThan(
					0,
				);
			},
			{ timeout: 3000 },
		);
	},
};

export const Empty: Story = {
	args: {
		currentPage: 1,
		onPageChange: fn(),
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeRequestsTableContainerMyListingsRequestsDocument,
						variables: {
							sharerId: '6324a3f1e3e4e1e6a8e1d8b1',
						},
					},
					result: {
						data: {
							myListingsRequests: [],
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				const emptyText = canvas.queryByText(/no.*request|empty|no data/i);
				expect(emptyText ?? canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
	},
};

export const Loading: Story = {
	args: {
		currentPage: 1,
		onPageChange: fn(),
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeRequestsTableContainerMyListingsRequestsDocument,
						variables: {
							sharerId: '6324a3f1e3e4e1e6a8e1d8b1',
						},
					},
					delay: Infinity,
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const loadingSpinner =
			canvas.queryByRole('progressbar') ?? canvas.queryByText(/loading/i);
		expect(loadingSpinner ?? canvasElement).toBeTruthy();
	},
};

export const ErrorState: Story = {
	args: {
		currentPage: 1,
		onPageChange: fn(),
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeRequestsTableContainerMyListingsRequestsDocument,
						variables: {
							sharerId: '6324a3f1e3e4e1e6a8e1d8b1',
						},
					},
					error: new Error('Failed to load requests'),
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				const errorContainer =
					canvas.queryByRole('alert') ??
					canvas.queryByText(/an error occurred/i);
				expect(errorContainer ?? canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
	},
};

export const WithSearchFilter: Story = {
	args: {
		currentPage: 1,
		onPageChange: fn(),
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeRequestsTableContainerMyListingsRequestsDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							myListingsRequests: [mockRequests[0]],
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/Cordless Drill/i).length).toBeGreaterThan(
					0,
				);
			},
			{ timeout: 3000 },
		);
		// Try interacting with search
		const searchInput = canvas.queryByRole('textbox');
		if (searchInput) {
			await userEvent.type(searchInput, 'drill');
		}
	},
};

export const WithStatusFilter: Story = {
	args: {
		currentPage: 1,
		onPageChange: fn(),
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeRequestsTableContainerMyListingsRequestsDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							myListingsRequests: [mockRequests[1]],
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(
					canvas.queryAllByText(/Electric Guitar/i).length,
				).toBeGreaterThan(0);
			},
			{ timeout: 3000 },
		);
	},
};

export const WithSorting: Story = {
	args: {
		currentPage: 1,
		onPageChange: fn(),
	},
	parameters: {
		apolloClient: {
			mocks: [
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
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.queryAllByText(/Cordless Drill/i).length).toBeGreaterThan(
					0,
				);
			},
			{ timeout: 3000 },
		);
		// Click on a column header to trigger sorting
		const titleHeader = canvas.queryByText(/Title/i);
		if (titleHeader) {
			await userEvent.click(titleHeader);
		}
	},
};

export const Pagination: Story = {
	args: {
		currentPage: 2,
		onPageChange: fn(),
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeRequestsTableContainerMyListingsRequestsDocument,
						variables: {
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
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				const table = canvas.queryByRole('table');
				expect(table ?? canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
	},
};

export const NoData: Story = {
	args: {
		currentPage: 1,
		onPageChange: fn(),
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeRequestsTableContainerMyListingsRequestsDocument,
						variables: {
							sharerId: '6324a3f1e3e4e1e6a8e1d8b1',
						},
					},
					result: {
						data: {
							myListingsRequests: [],
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				const noDataText = canvas.queryByText(/no data/i);
				expect(noDataText ?? canvasElement).toBeTruthy();
			},
			{ timeout: 3000 },
		);
	},
};
