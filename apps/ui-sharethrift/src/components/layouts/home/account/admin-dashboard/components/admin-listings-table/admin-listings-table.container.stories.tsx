import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { AdminListings } from './admin-listings-table.container.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../../../test-utils/storybook-decorators.tsx';
import {
	AdminListingsTableContainerAdminListingsDocument,
	AdminListingsTableContainerDeleteListingDocument,
	BlockListingContainerUnblockListingDocument,
} from '../../../../../../../generated.tsx';

const meta: Meta<typeof AdminListings> = {
	title: 'Containers/AdminListingsTableContainer',
	component: AdminListings,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminListingsTableContainerAdminListingsDocument,
						variables: {
							page: 1,
							pageSize: 6,
							statusFilters: ['Appeal Requested', 'Blocked'],
						},
					},
					result: {
						data: {
							adminListings: {
								__typename: 'AdminListingSearchResults',
								items: [
									{
										__typename: 'ListingAll',
										id: 'listing-1',
										title: 'Mountain Bike',
									images: ['https://example.com/bike.jpg'],
										state: 'Blocked',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
									},
								],
								total: 1,
								page: 1,
								pageSize: 6,
							},
						},
					},
				},
				{
					request: {
						query: BlockListingContainerUnblockListingDocument,
					},
					result: {
						data: {
							unblockListing: {
								__typename: 'BlockListingResult',
								id: 'listing-1',
								state: 'Published',
								success: true,
							},
						},
					},
				},
				{
					request: {
						query: AdminListingsTableContainerDeleteListingDocument,
					},
					result: {
						data: {
							deleteItemListing: {
								__typename: 'ItemListingMutationResult',
								status: {
									__typename: 'MutationStatus',
									success: true,
									errorMessage: null,
								},
							},
						},
					},
				},
			],
		},
	},
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-dashboard/listings'),
	],
};

export default meta;
type Story = StoryObj<typeof AdminListings>;

export const Default: Story = {
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};
