import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './index.tsx';
import { useState } from 'react';

const meta: Meta<typeof Header> = {
  title: 'Molecules/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof Header>;

export const LoggedOut: Story = {
  render: () => <Header isAuthenticated={false} onLogin={() => {}} onSignUp={() => {}} />,
};

export const LoggedIn: Story = {
  render: () => <Header isAuthenticated={true} />,
};

export const ResponsiveHeaderDemo = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <Header
      isAuthenticated={isAuthenticated}
      onLogin={() => setIsAuthenticated(true)}
      onSignUp={() => setIsAuthenticated(true)}
    />
  );
};
