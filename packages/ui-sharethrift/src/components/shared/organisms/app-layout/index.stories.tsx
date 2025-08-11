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
  <div >
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

export const LoggedIn: Story = {
  render: () => (
    <AppLayout
      isAuthenticated={true}
      onLogout={() => {}}
      onLogin={() => {}}
      onSignUp={() => {}}
      onNavigate={() => {}}
    >
      <DemoContent />
    </AppLayout>
  ),
};