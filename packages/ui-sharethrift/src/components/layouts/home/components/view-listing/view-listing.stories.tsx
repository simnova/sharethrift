import type { Meta, StoryObj } from '@storybook/react';
import { ViewListing } from './index';
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

const baseListing: ViewListingProps['listing'] = {
  id: 'listing123',
  title: 'City Bike',
  description: 'A great bike for city commuting. Well maintained and ready to ride! Perfect for getting around downtown and exploring the city. Features include front and rear lights, a comfortable seat, and smooth gear shifting.',
  price: 25,
  priceUnit: 'per day',
  location: 'Downtown Seattle',
  images: [
    '/api/placeholder/600/400',
    '/api/placeholder/600/400',
    '/api/placeholder/600/400',
  ],
  owner: {
    id: 'owner456',
    name: 'Patrick G.',
    avatar: '/api/placeholder/50/50',
    rating: 4.8,
    reviewCount: 23,
  },
  category: 'Transportation',
  condition: 'Excellent',
  availableFrom: '2024-07-04',
  availableTo: '2024-07-10',
  status: 'Active',
  itemName: 'Trek Hybrid Bike',
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
    currentUserId: 'user789',
    reservationRequestStatus: 'pending',
  },
};

export const AsOwner: Story = {
  args: {
    ...Default.args,
    userRole: 'sharer',
    isAuthenticated: true,
    currentUserId: 'owner456',
  },
};
