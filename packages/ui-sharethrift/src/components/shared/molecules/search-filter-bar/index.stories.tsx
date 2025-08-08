import type { Meta, StoryObj } from '@storybook/react';
import { SearchFilterBar } from './index';

const meta: Meta<typeof SearchFilterBar> = {
  title: 'Molecules/SearchFilterBar',
  component: SearchFilterBar,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof SearchFilterBar>;

export const LoggedOut: Story = {
  args: {
    showCreateButton: false,
    onSearch: (query) => console.log('Search:', query),
    onSearchChange: (value) => console.log('Search change:', value),
    onCategoryChange: (category) => console.log('Category change:', category),
  },
};

export const LoggedIn: Story = {
  args: {
    showCreateButton: true,
    onSearch: (query) => console.log('Search:', query),
    onSearchChange: (value) => console.log('Search change:', value),
    onCategoryChange: (category) => console.log('Category change:', category),
    onCreateListing: () => console.log('Create listing clicked'),
  },
};

export const WithFilters: Story = {
  args: {
    searchValue: 'bike',
    selectedCategory: 'Vehicles & Transportation',
    showCreateButton: true,
    onSearch: (query) => console.log('Search:', query),
    onSearchChange: (value) => console.log('Search change:', value),
    onCategoryChange: (category) => console.log('Category change:', category),
    onCreateListing: () => console.log('Create listing clicked'),
  },
};