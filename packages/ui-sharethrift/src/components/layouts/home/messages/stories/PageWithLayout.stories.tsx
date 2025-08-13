import type { Meta, StoryObj } from '@storybook/react';
import { AppLayout } from '../../../../shared/organisms/app-layout';
import { MockMessagesDemo } from '../components/mock-messages-demo';

const meta: Meta<typeof AppLayout> = {
  title: 'Pages/Messages',
  component: AppLayout,
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

export const Default = {
  render: () => (
    <AppLayout
      isAuthenticated={true}
      selectedKey="messages"
      onLogout={() => undefined}
      onLogin={() => undefined}
      onSignUp={() => undefined}
      onNavigate={(route) => {
        // In Storybook, just log navigation
        // eslint-disable-next-line no-console
        console.log('Navigate to:', route);
      }}
    >
      <MockMessagesDemo />
    </AppLayout>
  ),
};
