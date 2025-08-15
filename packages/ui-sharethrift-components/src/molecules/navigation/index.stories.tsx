import type { Meta, StoryObj } from '@storybook/react';
import { Navigation } from './index.tsx';
import { useState } from 'react';

const meta: Meta<typeof Navigation> = {
  title: 'Molecules/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof Navigation>;

export const LoggedOut: Story = {
  render: () => <Navigation isAuthenticated={false} onNavigate={() => {}} />,
};

const LoggedInDemo = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  return (
    <Navigation
      isAuthenticated={isAuthenticated}
      onLogout={() => setIsAuthenticated(false)}
      onNavigate={() => {}}
    />
  );
};

export const LoggedIn: Story = {
  render: () => <LoggedInDemo />,
};
