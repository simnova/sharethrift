import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ListingsGrid } from './index';
import { DUMMY_LISTINGS } from '../../../../components/layouts/home/components/mock-listings';

const meta: Meta<typeof ListingsGrid> = {
  title: 'Organisms/ListingsGrid',
  component: ListingsGrid,
  parameters: {
    layout: 'fullscreen',
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
  render: (args) => {
    function WithPaginationComponent(props: typeof args) {
      const [currentPage, setCurrentPage] = useState(1);
      const pageSize = 8;
      const pagedListings = DUMMY_LISTINGS.slice((currentPage - 1) * pageSize, currentPage * pageSize);
      return (
        <ListingsGrid
          {...props}
          listings={pagedListings}
          total={DUMMY_LISTINGS.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onListingClick={(listing) => console.log('Clicked listing:', listing.title)}
          onPageChange={(page) => setCurrentPage(page)}
        />
      );
    }
    return <WithPaginationComponent {...args} />;
  },
};

export const Empty: Story = {
  args: {
    listings: [],
    onListingClick: (listing) => console.log('Clicked listing:', listing.title),
  },
};