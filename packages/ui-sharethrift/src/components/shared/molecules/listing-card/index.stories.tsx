import type { Meta, StoryObj } from '@storybook/react';
import { ListingCard } from './index';
import type { MockListing } from '../../../../data/mockListings';

const meta: Meta<typeof ListingCard> = {
  title: 'Components/Molecules/ListingCard',
  component: ListingCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockListing: MockListing = {
  _id: '1',
  sharer: { _id: 'user1', firstName: 'John', lastName: 'Doe' },
  title: 'City Bike',
  description: 'Perfect city bike for commuting around town. Well maintained and ready to ride.',
  category: 'Vehicles & Transportation',
  location: 'Philadelphia, PA',
  sharingPeriodStart: '2025-01-15T00:00:00Z',
  sharingPeriodEnd: '2025-02-28T23:59:59Z',
  state: 'Published',
  updatedAt: '2025-01-10T10:00:00Z',
  createdAt: '2025-01-08T15:30:00Z',
  sharingHistory: [],
  reports: 0,
  image: '/src/assets/item-images/bike.png'
};

export const Default: Story = {
  args: {
    listing: mockListing,
  },
};

export const Electronics: Story = {
  args: {
    listing: {
      ...mockListing,
      _id: '2',
      title: 'Wireless Earbuds',
      description: 'High-quality wireless earbuds with noise cancellation.',
      category: 'Electronics',
      image: '/src/assets/item-images/airpods.png',
      sharer: { _id: 'user2', firstName: 'Sarah', lastName: 'Johnson' },
    },
  },
};

export const LongTitle: Story = {
  args: {
    listing: {
      ...mockListing,
      title: 'Professional High-End 4K Projector for Presentations and Movie Nights',
      description: 'This is a very long description that might wrap to multiple lines and test how the card handles longer content.',
      category: 'Electronics',
    },
  },
};