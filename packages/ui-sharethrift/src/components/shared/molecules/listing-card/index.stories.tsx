import type { Meta, StoryObj } from '@storybook/react';
import { ListingCard } from './index';
import type { ItemListing } from '../../../../types/listing';

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
  render: (args) => (
    <div style={{ width: 280 }}>
      <ListingCard {...args} />
    </div>
  ),
};