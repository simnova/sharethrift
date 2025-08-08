import type { Meta, StoryObj } from '@storybook/react';
import { HeroSection } from './index';

const meta: Meta<typeof HeroSection> = {
  title: 'Molecules/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {
  args: {
    onSearch: (query) => console.log('Search:', query),
    onSearchChange: (value) => console.log('Search change:', value),
  },
};

export const WithValue: Story = {
  args: {
    searchValue: 'bike',
    onSearch: (query) => console.log('Search:', query),
    onSearchChange: (value) => console.log('Search change:', value),
  },
};