import type { Meta, StoryObj } from '@storybook/react';
import {
	BlockListingContainerBlockListingDocument,
	BlockListingContainerUnblockListingDocument,
	ViewListingDocument,
} from '../../../../../generated.tsx';
import { withMockApolloClient } from '../../../../../test-utils/storybook-decorators.tsx';
import { BlockListingButton } from './block-listing.container.tsx';

const meta: Meta<typeof BlockListingButton> = {
	title: 'Containers/BlockListingButton',
	component: BlockListingButton,
	parameters: {
		layout: 'centered',
		apolloClient: {
			mocks: [
				{
					request: {
						query: BlockListingContainerBlockListingDocument,
						variables: { id: 'listing-1' },
					},
					result: {
						data: {
							blockListing: {
								__typename: 'ItemListing',
								id: 'listing-1',
								isBlocked: true,
							},
						},
					},
				},
				{
					request: {
						query: BlockListingContainerUnblockListingDocument,
						variables: { id: 'listing-1' },
					},
					result: {
						data: {
							unblockListing: {
								__typename: 'ItemListing',
								id: 'listing-1',
								isBlocked: false,
							},
						},
					},
				},
				{
					request: {
						query: ViewListingDocument,
						variables: { id: 'listing-1' },
					},
					result: {
						data: {
							itemListing: {
								__typename: 'ItemListing',
								id: 'listing-1',
								title: 'City Bike',
								description: 'A great city bike',
								category: 'Sports & Outdoors',
								location: 'Toronto, ON',
								state: 'Published',
								images: [],
								sharingPeriodStart: '2025-01-01',
								sharingPeriodEnd: '2025-12-31',
								createdAt: '2025-01-01T00:00:00Z',
								updatedAt: '2025-01-01T00:00:00Z',
								isBlocked: false,
								sharer: {
									__typename: 'PersonalUser',
									id: 'user-1',
									profile: {
										firstName: 'John',
										lastName: 'Doe',
									},
								},
							},
						},
					},
				},
			],
		},
	},
	decorators: [withMockApolloClient],
	tags: ['autodocs'],
	argTypes: {
		listingId: { control: 'text' },
		listingTitle: { control: 'text' },
		isBlocked: { control: 'boolean' },
		sharerId: { control: 'text' },
		renderModals: { control: 'boolean' },
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BlockButton: Story = {
	args: {
		listingId: 'listing-1',
		listingTitle: 'City Bike',
		isBlocked: false,
		sharerId: 'user-1',
		renderModals: true,
	},
};

export const UnblockButton: Story = {
	args: {
		listingId: 'listing-1',
		listingTitle: 'City Bike',
		isBlocked: true,
		sharerId: 'user-1',
		renderModals: true,
	},
};

export const BlockButtonWithoutModals: Story = {
	args: {
		listingId: 'listing-1',
		listingTitle: 'City Bike',
		isBlocked: false,
		sharerId: 'user-1',
		renderModals: false,
	},
};

export const UnblockButtonWithoutModals: Story = {
	args: {
		listingId: 'listing-1',
		listingTitle: 'City Bike',
		isBlocked: true,
		sharerId: 'user-1',
		renderModals: false,
	},
};

export const WithDefaultSharer: Story = {
	args: {
		listingId: 'listing-1',
		listingTitle: 'Professional Camera',
		isBlocked: false,
		renderModals: true,
	},
};
