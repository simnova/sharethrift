import type { Meta, StoryObj } from '@storybook/react';
import { SearchFilterBar } from './index';

const meta: Meta<typeof SearchFilterBar> = {
  title: 'Components/Molecules/SearchFilterBar',
  component: SearchFilterBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    onSearch: { action: 'searched' },
    onCategoryChange: { action: 'category changed' },
    onLocationChange: { action: 'location changed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    searchValue: '',
    selectedCategory: 'All',
    location: 'Philadelphia, PA',
    showLocation: true,
  },
};

export const WithoutLocation: Story = {
  args: {
    searchValue: '',
    selectedCategory: 'All',
    showLocation: false,
  },
};

export const WithFilters: Story = {
  args: {
    searchValue: 'bike',
    selectedCategory: 'Vehicles & Transportation',
    location: 'Philadelphia, PA',
    showLocation: true,
  },
};