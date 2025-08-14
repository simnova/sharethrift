import Listings from '../pages/Listings';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Listings> = {
  title: 'Pages/Browse Listings',
  component: Listings,
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof Listings>;

export const LoggedIn: Story = {
  render: () => <Listings isAuthenticated={true} />,
};

export const LoggedOut: Story = {
  render: () => <Listings isAuthenticated={false} />,
};
