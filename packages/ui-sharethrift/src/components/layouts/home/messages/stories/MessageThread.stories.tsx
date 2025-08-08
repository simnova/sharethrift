import type { Meta, StoryObj } from '@storybook/react';
import { MessageThread } from '../components/message-thread';

const mockMessages = [
  {
    id: 'm1',
    twilioMessageSid: 'MS1',
    conversationId: '1',
    authorId: 'user123',
    content: 'Hey, is the bike still available?',
    createdAt: '2025-08-08T10:01:00Z',
  },
  {
    id: 'm2',
    twilioMessageSid: 'MS2',
    conversationId: '1',
    authorId: 'Alice',
    content: 'Yes! You can pick it up anytime today.',
    createdAt: '2025-08-08T10:02:00Z',
  },
  {
    id: 'm3',
    twilioMessageSid: 'MS3',
    conversationId: '1',
    authorId: 'user123',
    content: 'Great, I will come by at 5pm.',
    createdAt: '2025-08-08T10:03:00Z',
  },
  {
    id: 'm4',
    twilioMessageSid: 'MS4',
    conversationId: '1',
    authorId: 'Alice',
    content: 'See you then!',
    createdAt: '2025-08-08T10:04:00Z',
  },
];

const meta: Meta<typeof MessageThread> = {
  title: 'Messages/MessageThread',
  component: MessageThread,
  parameters: {
    layout: 'centered',
  },
};
export default meta;
type Story = StoryObj<typeof MessageThread>;

export const Default: Story = {
  args: {
    conversationId: '1',
    messages: mockMessages,
  },
};
