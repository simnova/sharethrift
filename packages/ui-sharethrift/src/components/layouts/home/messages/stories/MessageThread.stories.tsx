import type { Meta, StoryObj } from '@storybook/react';
import { MessageThread } from '../components/message-thread';

const mockMessages = [
  {
    id: 'm1',
    twilioMessageSid: 'SM1',
    conversationId: '1',
    authorId: 'user123',
    content: 'Hey Alice, is the bike still available?',
    createdAt: '2025-08-08T12:01:00Z',
  },
  {
    id: 'm2',
    twilioMessageSid: 'SM2',
    conversationId: '1',
    authorId: 'Alice',
    content: 'Yes, it is! Do you want to see it?',
    createdAt: '2025-08-08T12:02:00Z',
  },
];

const meta: Meta<typeof MessageThread> = {
  title: 'Messages/MessageThread',
  component: MessageThread,
};
export default meta;
type Story = StoryObj<typeof MessageThread>;

export const Default: Story = {
  args: {
    conversationId: '1',
    messages: mockMessages,
    loading: false,
    error: null,
    messageText: '',
    setMessageText: () => {},
    sendingMessage: false,
    handleSendMessage: () => {},
    messagesEndRef: { current: null },
    currentUserId: 'user123',
    contentContainerStyle: { paddingLeft: 24 },
  },
};
