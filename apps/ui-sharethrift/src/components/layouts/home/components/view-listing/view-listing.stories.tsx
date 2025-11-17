import type { Meta, StoryObj } from '@storybook/react';
import { ViewListing } from './view-listing.tsx';
import {
	type ItemListing,
	ViewListingImageGalleryGetImagesDocument,
	ViewListingInformationGetListingDocument,
} from '../../../../../generated.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../test-utils/storybook-decorators.tsx';

// Local mock listing data (removed dependency on DUMMY_LISTINGS)
const baseListingId = 'mock-listing-id-1';
const MOCK_LISTING_BASE: ItemListing = {
	id: baseListingId as string, // GraphQL generated type may treat id as scalar (any)
	title: 'Cordless Drill',
	description: '18V cordless drill with two batteries and charger.',
	category: 'Tools',
	location: 'Philadelphia, PA',
	sharingPeriodStart: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
	sharingPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // in 10 days
	state: 'Published' as string,
	images: [
		'https://placehold.co/600x400?text=Drill+1',
		'https://placehold.co/600x400?text=Drill+2',
	],
	createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
	updatedAt: new Date(),
	reports: 0,
	sharingHistory: [],
	schemaVersion: '1.0',
	sharer: {
		__typename: 'PersonalUser',
		id: 'mock-sharer-id',
		account: {
			username: 'patrickg',
			profile: {
				firstName: 'Patrick',
				lastName: 'G.',
				location: { city: 'Philadelphia', state: 'PA', country: 'USA' },
			},
		},
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		isBlocked: false,
		schemaVersion: '1.0',
		userType: 'personal',
	},
    listingType: 'item-listing',
};

const mocks = [
	{
		request: {
			query: ViewListingImageGalleryGetImagesDocument,
			variables: { listingId: baseListingId },
		},
		result: { data: { itemListing: { images: MOCK_LISTING_BASE.images } } },
	},
	{
		request: {
			query: ViewListingInformationGetListingDocument,
			variables: { listingId: baseListingId },
		},
		result: {
			data: {
				itemListing: {
					id: baseListingId,
					title: MOCK_LISTING_BASE.title,
					description: MOCK_LISTING_BASE.description,
					category: MOCK_LISTING_BASE.category,
					location: MOCK_LISTING_BASE.location,
					sharingPeriodStart:
						MOCK_LISTING_BASE.sharingPeriodStart.toISOString(),
					sharingPeriodEnd: MOCK_LISTING_BASE.sharingPeriodEnd.toISOString(),
					state: MOCK_LISTING_BASE.state,
					images: MOCK_LISTING_BASE.images,
					createdAt: MOCK_LISTING_BASE.createdAt?.toISOString(),
					updatedAt: MOCK_LISTING_BASE.updatedAt?.toISOString(),
					reports: MOCK_LISTING_BASE.reports,
					sharingHistory: MOCK_LISTING_BASE.sharingHistory,
					sharer: MOCK_LISTING_BASE.sharer,
					schemaVersion: MOCK_LISTING_BASE.schemaVersion,
				},
			},
		},
	},
];

const meta: Meta<typeof ViewListing> = {
	title: 'Home/ViewListing',
	component: ViewListing,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks,
		},
	},
	decorators: [
		withMockApolloClient,
		withMockRouter('/listing/mock-listing-id-1'),
	],
};
export default meta;

type Story = StoryObj<typeof ViewListing>;

const baseListing = MOCK_LISTING_BASE;

export const Default: Story = {
	args: {
		listing: baseListing,
		userIsSharer: false,
		isAuthenticated: false,
		userReservationRequest: null,
		sharedTimeAgo: '2 days ago',
	},
};

export const AsReserver: Story = {
	args: {
		...Default.args,
		userIsSharer: false,
		isAuthenticated: true,
		userReservationRequest: null,
	},
};

export const AsOwner: Story = {
	args: {
		...Default.args,
		userIsSharer: true,
		isAuthenticated: true,
		userReservationRequest: null,
	},
};
