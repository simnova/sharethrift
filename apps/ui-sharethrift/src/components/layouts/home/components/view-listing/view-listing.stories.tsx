import type { Meta, StoryObj } from '@storybook/react';
import { ViewListing } from './view-listing';
//import type { ViewListingProps } from "./view-listing";
import type { ItemListing } from '../../../../../generated';
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

const baseListingId = DUMMY_LISTINGS[0]._id;

const mocks = [
	{
		request: {
			query: GET_LISTING_IMAGES,
			variables: { listingId: baseListingId },
		},
		result: {
			data: {
				itemListing: {
					images: DUMMY_LISTINGS[0].images,
				},
			},
		},
	},
	{
		request: {
			query: GET_LISTING_INFORMATION,
			variables: { listingId: baseListingId },
		},
		result: {
			data: {
				itemListing: {
					id: baseListingId,
					title: DUMMY_LISTINGS[0].title,
					description: DUMMY_LISTINGS[0].description,
					category: DUMMY_LISTINGS[0].category,
					location: DUMMY_LISTINGS[0].location,
					sharingPeriodStart:
						DUMMY_LISTINGS[0].sharingPeriodStart.toISOString(),
					sharingPeriodEnd: DUMMY_LISTINGS[0].sharingPeriodEnd.toISOString(),
					state: DUMMY_LISTINGS[0].state,
					images: DUMMY_LISTINGS[0].images,
					createdAt:
						DUMMY_LISTINGS[0].createdAt?.toISOString() ??
						new Date().toISOString(),
					updatedAt:
						DUMMY_LISTINGS[0].updatedAt?.toISOString() ??
						new Date().toISOString(),
					reports: 0,
					sharingHistory: [],
					sharer: {
						__typename: 'PersonalUser',
						id: 'dummy-sharer-id',
						account: {
							username: 'patrickg',
							profile: {
								firstName: 'Patrick',
								lastName: 'G.',
								location: {
									city: 'Philadelphia',
									state: 'PA',
									country: 'USA',
								},
							},
						},
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
						isBlocked: false,
						schemaVersion: '1.0',
						userType: 'personal',
					},
					schemaVersion: '1.0',
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

import { DUMMY_LISTINGS } from '../mock-listings';

const baseListing: ItemListing = {
	...DUMMY_LISTINGS[0],
	id: DUMMY_LISTINGS[0]._id, // add id field for compatibility with queries/components
	state:
		DUMMY_LISTINGS[0].state === 'Appeal Requested'
			? 'Appeal_Requested'
			: DUMMY_LISTINGS[0].state,
	sharer: {
		__typename: 'PersonalUser',
		id: 'dummy-sharer-id',
		account: {
			username: 'patrickg',
			profile: {
				firstName: 'Patrick',
				lastName: 'G.',
				location: {
					city: 'Philadelphia',
					state: 'PA',
					country: 'USA',
				},
			},
		},
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		isBlocked: false,
		schemaVersion: '1.0',
		userType: 'personal',
	},
};

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
