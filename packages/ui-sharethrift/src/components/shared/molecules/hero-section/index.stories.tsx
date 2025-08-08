import type { Meta, StoryObj } from '@storybook/react';
import { HeroSection } from './index';

const meta: Meta<typeof HeroSection> = {
  title: 'Components/Molecules/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    onSearch: { action: 'searched' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    searchValue: '',
  },
};

export const WithSearchValue: Story = {
  args: {
    searchValue: 'bike',
  },
};