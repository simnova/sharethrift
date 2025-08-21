import type { Meta, StoryObj } from '@storybook/react';
import { ViewListing } from './view-listing';
import type { ViewListingProps } from './view-listing';

const meta: Meta<typeof ViewListing> = {
  title: 'Home/ViewListing',
  component: ViewListing,
  parameters: {
    layout: 'fullscreen',
  },
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
