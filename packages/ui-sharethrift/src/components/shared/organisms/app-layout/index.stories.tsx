import type { Meta, StoryObj } from '@storybook/react';
import { AppLayout } from './index';
import React, { useState } from 'react';

const meta: Meta<typeof AppLayout> = {
  title: 'Organisms/AppLayout',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof AppLayout>;

const DemoContent = () => (
  <div style={{ minHeight: 400 }}>
    <h1>Welcome to the App Layout</h1>
    <p>This is the main content area. Add your page content here.</p>
  </div>
);

export const LoggedOut: Story = {
  render: () => (
    <AppLayout isAuthenticated={false}>
      <DemoContent />
    </AppLayout>
  ),
};

const LoggedInDemo: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  return (
    <AppLayout
      isAuthenticated={isAuthenticated}
      onLogout={() => setIsAuthenticated(false)}
      onLogin={() => setIsAuthenticated(true)}
      onSignUp={() => setIsAuthenticated(true)}
      onNavigate={() => {}}
    >
      <DemoContent />
    </AppLayout>
  );
};

export const LoggedIn: Story = {
  render: () => <LoggedInDemo />,
};