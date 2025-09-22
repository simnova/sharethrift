import type { Meta, StoryObj } from '@storybook/react';
import { ListingCard } from './index.tsx';
import { MemoryRouter } from 'react-router-dom';

export interface ItemListing {
  _id: string;
  sharer: string; // User reference
  title: string;
  description: string;
  category: string;
  location: string;
  sharingPeriodStart: Date;
  sharingPeriodEnd: Date;
  state?: 'Published' | 'Paused' | 'Cancelled' | 'Drafted' | 'Expired' | 'Blocked' | 'Appeal Requested';
  updatedAt?: Date;
  createdAt?: Date;
  sharingHistory?: string[]; // objectid[]
  reports?: number;
  images?: string[]; // For UI purposes, we'll add image URLs
}

const sampleListing: ItemListing = {
  _id: '1',
  sharer: 'user1',
  title: 'City Bike',
  description: 'Perfect city bike for commuting and leisure rides around the neighborhood.',
  category: 'Vehicles & Transportation',
  location: 'Philadelphia, PA',
  sharingPeriodStart: new Date('2024-08-11'),
  sharingPeriodEnd: new Date('2024-12-23'),
  state: 'Published',
  images: ['/src/assets/item-images/bike.png'],
  createdAt: new Date('2024-08-01'),
  updatedAt: new Date('2024-08-01'),
};

const meta: Meta<typeof ListingCard> = {
  title: 'Molecules/Listing Card',
  component: ListingCard,
  parameters: {
    layout: 'centered',
  },
  args: {
    listing: sampleListing,
  },
};

export default meta;
type Story = StoryObj<typeof ListingCard>;

export const Default: Story = {
  render: (args: { listing: ItemListing }) => (
    <MemoryRouter>
      <div style={{ width: 280 }}>
        <ListingCard {...args} />
      </div>
    </MemoryRouter>
  ),
};