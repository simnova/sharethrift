import type { Meta, StoryObj } from '@storybook/react';
import { AllListingsCard } from '../components/all-listings-card';

const MOCK_LISTING = {
  id: '1',
  title: 'Cordless Drill',
  image: '/assets/item-images/projector.png',
  publishedAt: '2025-12-23',
  reservationPeriod: '2020-11-08 - 2020-12-23',
  status: 'Paused',
  pendingRequestsCount: 0,
};

const meta: Meta<typeof AllListingsCard> = {
  title: 'My Listings/All Listings Card',
  component: AllListingsCard,
  args: {
    listing: MOCK_LISTING,
    onViewPendingRequests: (id: string) => console.log('View pending requests:', id),
    onAction: (action: string, id: string) => console.log('Action:', action, 'Listing ID:', id),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
