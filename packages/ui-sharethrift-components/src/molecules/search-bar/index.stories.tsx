import { SearchBar } from './index.tsx';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SearchBar> = {
  title: 'Molecules/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  render: () => <SearchBar />,
};
