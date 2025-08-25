import type { Meta, StoryObj } from '@storybook/react';
import { MyListingsDashboard } from './my-listings-dashboard';

const meta: Meta<typeof MyListingsDashboard> = {
  title: 'My Listings/Dashboard',
  component: MyListingsDashboard,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onCreateListing: () => console.log('Create listing clicked'),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};