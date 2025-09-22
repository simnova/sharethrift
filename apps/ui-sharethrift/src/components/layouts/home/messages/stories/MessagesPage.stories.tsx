import type { Meta, StoryObj } from '@storybook/react';
import { MockMessagesDemo } from '../components/mock-messages-demo';

const meta: Meta<typeof MockMessagesDemo> = {
  title: 'Pages/MessagesPage',
  component: MockMessagesDemo,
};
export default meta;
type Story = StoryObj<typeof MockMessagesDemo>;

export const Default: Story = {
  args: {},
};
