import type { Meta, StoryObj } from '@storybook/react';
import { MockMessagesDemo } from '../components/mock-messages-demo';

const meta: Meta<typeof MockMessagesDemo> = {
  title: 'Messages/Page',
  component: MockMessagesDemo,
};
export default meta;
type Story = StoryObj<typeof MockMessagesDemo>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 900, height: 600, background: '#f8f8f8', padding: 0 }}>
      <MockMessagesDemo />
    </div>
  ),
  args: {},
};
