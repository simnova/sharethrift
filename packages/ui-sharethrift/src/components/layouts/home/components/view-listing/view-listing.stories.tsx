
import type { Meta, StoryObj } from '@storybook/react';
import { ViewListing } from './view-listing';
import type { ViewListingProps } from './view-listing';

import { MockedProvider } from '@apollo/client/testing';
import { gql } from '@apollo/client';



// GraphQL queries (must match containers exactly)
const GET_LISTING_IMAGES = gql`
  query ViewListingImageGalleryGetImages($listingId: ObjectID!) {
    itemListing(id: $listingId) {
      images
      title
    }
  }
`;
const GET_LISTING_INFORMATION = gql`
  query ViewListingInformationGetListing($listingId: ObjectID!) {
    itemListing(id: $listingId) {
      id
      title
      description
      category
      location
      sharingPeriodStart
      sharingPeriodEnd
      state
    }
  }
`;

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
          title: DUMMY_LISTINGS[0].title,
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
          sharingPeriodStart: DUMMY_LISTINGS[0].sharingPeriodStart.toISOString(),
          sharingPeriodEnd: DUMMY_LISTINGS[0].sharingPeriodEnd.toISOString(),
          state: DUMMY_LISTINGS[0].state,
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
    (Story, context) => {
      // Add a console log to debug the variables passed to the query
      // This will only log in the Storybook browser console
      if (typeof window !== 'undefined') {
        const origFetch = window.fetch;
        window.fetch = function(...args) {
          // Log all GraphQL POST requests
          if (args[0] && typeof args[0] === 'string' && args[0].includes('/graphql')) {
            try {
              const body = JSON.parse(args[1]?.body || '{}');
              if (body && body.variables) {
                // eslint-disable-next-line no-console
                console.log('[Storybook GraphQL Variables]', body.variables);
              }
            } catch {}
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

const baseListing: ViewListingProps['listing'] = {
  ...DUMMY_LISTINGS[0],
};

export const Default: Story = {
  args: {
    listing: baseListing,
    userRole: 'logged-out',
    isAuthenticated: false,
    currentUserId: '',
    sharedTimeAgo: '2 days ago',
  },
};

export const AsReserver: Story = {
  args: {
    ...Default.args,
    userRole: 'reserver',
    isAuthenticated: true,
    currentUserId: 'user2',
    reservationRequestStatus: 'pending',
  },
};

export const AsOwner: Story = {
  args: {
    ...Default.args,
    userRole: 'sharer',
    isAuthenticated: true,
    currentUserId: baseListing.sharer,
  },
};
