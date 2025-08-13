import Listings from './Listings';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Listings> = {
  title: 'Pages/Home/Listings',
  component: Listings,
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof Listings>;

export const LoggedIn: Story = {
  render: () => <Listings loggedIn={true} />, // Simulate logged-in state
};

export const LoggedOut: Story = {
  render: () => <Listings loggedIn={false} />, // Simulate logged-out state
};
