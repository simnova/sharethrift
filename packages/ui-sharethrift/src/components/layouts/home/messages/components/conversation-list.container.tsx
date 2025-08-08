// import { useQuery } from '@apollo/client';
// import GET_USER_CONVERSATIONS from './conversation-list.container.graphql';
import { ConversationList } from './conversation-list';

interface ConversationListContainerProps {
  onConversationSelect: (conversationId: string) => void;
  selectedConversationId: string | null;
}

export function ConversationListContainer({ onConversationSelect, selectedConversationId }: ConversationListContainerProps) {
  // TODO: Get actual user ID from authentication context
  const currentUserId = 'user123'; // Placeholder

//   const { data, loading, error } = useQuery(GET_USER_CONVERSATIONS, {
//     variables: { userId: currentUserId }
//   });

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

  return (
    <ConversationList
      onConversationSelect={(id: string) => {
        // eslint-disable-next-line no-console
        console.log('Selected conversation:', id);
      }}
      selectedConversationId="1"
      conversations={mockConversations}
    />
  );
}
