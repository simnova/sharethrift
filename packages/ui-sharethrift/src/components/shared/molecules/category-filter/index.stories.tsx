import { CategoryFilter } from './index';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof CategoryFilter> = {
  title: 'Molecules/Category Filter',
  component: CategoryFilter,
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof CategoryFilter>;

export const Default: Story = {
  render: () => {
    const [selectedCategory, setSelectedCategory] = useState('');

    return (
      <CategoryFilter
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      />
    );
  },
};
