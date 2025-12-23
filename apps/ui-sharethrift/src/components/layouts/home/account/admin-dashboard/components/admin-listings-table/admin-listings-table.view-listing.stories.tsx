import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { AdminViewListing } from './admin-listings-table.view-listing.tsx';
import { withMockApolloClient, withMockRouter } from '../../../../../../../test-utils/storybook-decorators.tsx';
import {
	AdminListingsTableContainerAdminListingsDocument,
	AdminListingsTableContainerDeleteListingDocument,
	BlockListingContainerUnblockListingDocument,
} from '../../../../../../../generated.tsx';

const meta = {
	title: 'Components/AdminViewListing',
	component: AdminViewListing,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminListingsTableContainerAdminListingsDocument,
						variables: {
							page: 1,
							pageSize: 100,
							statusFilters: ['Blocked', 'Active'],
						},
					},
					result: {
						data: {
							adminListings: {
								__typename: 'AdminListingSearchResults',
								items: [
									{
										__typename: 'ListingAll',
										id: 'listing-123',
										title: 'Mountain Bike for Weekend',
										images: [
											'https://via.placeholder.com/300',
										],
										state: 'Blocked',
										createdAt: '2024-11-01T10:00:00Z',
										sharingPeriodStart: '2024-12-01',
										sharingPeriodEnd: '2024-12-15',
									},
								],
								total: 1,
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
								id: 'listing-123',
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
	decorators: [withMockApolloClient, withMockRouter('/account/admin-dashboard/listings/listing-123')],
} satisfies Meta<typeof AdminViewListing>;

export default meta;
type Story = StoryObj<typeof AdminViewListing>;

export const Default: Story = {
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};
