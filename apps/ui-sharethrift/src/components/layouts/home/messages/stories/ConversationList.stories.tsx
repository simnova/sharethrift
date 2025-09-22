import type { Meta, StoryObj } from '@storybook/react';
import { ConversationList } from '../components/conversation-list';

const mockConversations = [
  {
    id: '1',
    twilioConversationSid: 'CH123',
    listingId: 'Bike-001',
    participants: ['user123', 'Alice'],
    createdAt: '2025-08-08T10:00:00Z',
    updatedAt: '2025-08-08T12:00:00Z',
  },
  {
    id: '2',
    twilioConversationSid: 'CH124',
    listingId: 'Camera-002',
    participants: ['user123', 'Bob'],
    createdAt: '2025-08-07T09:00:00Z',
    updatedAt: '2025-08-08T11:30:00Z',
  },
  {
    id: '3',
    twilioConversationSid: 'CH125',
    listingId: 'Tent-003',
    participants: ['user123', 'Carol'],
    createdAt: '2025-08-06T08:00:00Z',
    updatedAt: '2025-08-08T10:45:00Z',
  },
];

const meta: Meta<typeof ConversationList> = {
  title: 'Messages/ConversationList',
  component: ConversationList,
};
export default meta;
type Story = StoryObj<typeof ConversationList>;

export const Default: Story = {
  args: {
    onConversationSelect: () => {},
    selectedConversationId: '1',
    conversations: mockConversations,
  },
};
