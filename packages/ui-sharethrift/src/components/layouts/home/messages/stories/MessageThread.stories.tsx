
import React from 'react';
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



const noop = () => undefined;
const messagesEndRef = React.createRef<HTMLDivElement>();

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 400, height: 600, background: '#f8f8f8', padding: 16 }}>
      <MessageThread {...args} />
    </div>
  ),
  args: {
    conversationId: '1',
    messages: mockMessages,
    loading: false,
    error: undefined,
    messageText: '',
    setMessageText: noop,
    sendingMessage: false,
    handleSendMessage: noop,
    messagesEndRef,
    currentUserId: 'user123',
    contentContainerStyle: {},
  },
};
