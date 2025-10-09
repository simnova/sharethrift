import type { Meta, StoryObj } from '@storybook/react';
import { ViewListing } from './view-listing.tsx';
//import type { ViewListingProps } from "./view-listing";
import type { ItemListing } from '../../../../../generated.tsx';
import { MockedProvider } from '@apollo/client/testing';
import { gql } from '@apollo/client';

// eslint-disable-next-line import/no-absolute-path, @typescript-eslint/ban-ts-comment
// @ts-ignore - allow raw import string
import ListingImagesQuerySource from './listing-image-gallery/listing-image-gallery.graphql?raw';
// eslint-disable-next-line import/no-absolute-path, @typescript-eslint/ban-ts-comment
// @ts-ignore - allow raw import string
import ListingInformationQuerySource from './listing-information/listing-information.graphql?raw';

const GET_LISTING_IMAGES = gql(ListingImagesQuerySource);
const GET_LISTING_INFORMATION = gql(ListingInformationQuerySource);

// Local mock listing data (removed dependency on DUMMY_LISTINGS)
const baseListingId = 'mock-listing-id-1';
const MOCK_LISTING_BASE: ItemListing = {
	id: baseListingId as any, // GraphQL generated type may treat id as scalar (any)
	title: 'Cordless Drill',
	description: '18V cordless drill with two batteries and charger.',
	category: 'Tools',
	location: 'Philadelphia, PA',
	sharingPeriodStart: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
	sharingPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // in 10 days
	state: 'Published' as any,
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
};

const mocks = [
	{
		request: { query: GET_LISTING_IMAGES, variables: { listingId: baseListingId } },
		result: { data: { itemListing: { images: MOCK_LISTING_BASE.images } } },
	},
	{
		request: { query: GET_LISTING_INFORMATION, variables: { listingId: baseListingId } },
		result: {
			data: {
				itemListing: {
					id: baseListingId,
					title: MOCK_LISTING_BASE.title,
					description: MOCK_LISTING_BASE.description,
					category: MOCK_LISTING_BASE.category,
					location: MOCK_LISTING_BASE.location,
					sharingPeriodStart: MOCK_LISTING_BASE.sharingPeriodStart.toISOString(),
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
	},
	decorators: [
		(Story) => {
			// Add a console log to debug the variables passed to the query
			if (typeof window !== 'undefined') {
				const origFetch = window.fetch;
				window.fetch = function (...args) {
					if (
						args[0] &&
						typeof args[0] === 'string' &&
						args[0].includes('/graphql')
					) {
						try {
							const maybeBody = args[1]?.body;
							if (typeof maybeBody === 'string') {
								const body = JSON.parse(maybeBody);
								if (body?.variables) {
									console.log('[Storybook GraphQL Variables]', body.variables);
								}
							}
						} catch (_error) {
							// Ignore parsing errors for non-GraphQL requests
						}
					}
					return origFetch.apply(this, args);
				};
			}
			return (
				<MockedProvider mocks={mocks}>
					<Story />
				</MockedProvider>
			);
		},
	],
};
export default meta;

type Story = StoryObj<typeof ViewListing>;

const baseListing: ItemListing = MOCK_LISTING_BASE as ItemListing;

export const Default: Story = {
	args: {
		listing: baseListing,
		userIsSharer: false,
		isAuthenticated: false,
		sharedTimeAgo: '2 days ago',
	},
};

export const AsReserver: Story = {
	args: {
		...Default.args,
		userIsSharer: false,
		isAuthenticated: true,
	},
};

export const AsOwner: Story = {
	args: {
		...Default.args,
		userIsSharer: true,
		isAuthenticated: true,
	},
};
