import type { Meta, StoryObj } from '@storybook/react';
import { CreateListing } from './create-listing';

const meta: Meta<typeof CreateListing> = {
  title: 'Components/CreateListing',
  component: CreateListing,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    categories: [
      'Electronics',
      'Home & Garden', 
      'Kids & Baby',
      'Miscellaneous',
      'Sports & Outdoors',
      'Tools & Equipment',
      'Vehicles & Transportation'
    ],
    isLoading: false,
    onSubmit: () => {},
    onCancel: () => {},
    uploadedImages: [],
    onImageAdd: () => {
      // Mock image addition
    },
    onImageRemove: () => {
      // Mock image removal
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithImages: Story = {
  args: {
    uploadedImages: [
      '/assets/item-images/bike.png',
      '/assets/item-images/tent.png',
      '/assets/item-images/projector.png',
    ],
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};