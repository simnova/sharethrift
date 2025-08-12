import type { Meta, StoryObj } from '@storybook/react';
import { ListingsGrid } from './index';
import { DUMMY_LISTINGS } from '../../../../data/dummy-listings';

const meta: Meta<typeof ListingsGrid> = {
  title: 'Organisms/ListingsGrid',
  component: ListingsGrid,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ListingsGrid>;

export const Default: Story = {
  args: {
    listings: DUMMY_LISTINGS,
    onListingClick: (listing) => console.log('Clicked listing:', listing.title),
  },
};

export const WithPagination: Story = {
  args: {
    listings: DUMMY_LISTINGS.slice(0, 8),
    total: DUMMY_LISTINGS.length,
    currentPage: 1,
    pageSize: 8,
    onListingClick: (listing) => console.log('Clicked listing:', listing.title),
    onPageChange: (page, pageSize) => console.log('Page change:', page, pageSize),
  },
};

export const Empty: Story = {
  args: {
    listings: [],
    onListingClick: (listing) => console.log('Clicked listing:', listing.title),
  },
};

export const SingleRow: Story = {
  args: {
    listings: DUMMY_LISTINGS.slice(0, 4),
    showPagination: false,
    onListingClick: (listing) => console.log('Clicked listing:', listing.title),
  },
};