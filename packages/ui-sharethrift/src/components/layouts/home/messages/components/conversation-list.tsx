import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_USER_CONVERSATIONS = gql`
  query GetUserConversations($userId: ID!) {
    getUserConversations(userId: $userId) {
      id
      twilioConversationSid
      listingId
      participants
      createdAt
      updatedAt
    }
  }
`;

interface Conversation {
  id: string;
  twilioConversationSid: string;
  listingId: string;
  participants: string[];
  createdAt: string;
  updatedAt: string;
}

interface ConversationListProps {
  onConversationSelect: (conversationId: string) => void;
  selectedConversationId: string | null;
}

export function ConversationList({ onConversationSelect, selectedConversationId }: ConversationListProps) {
  // TODO: Get actual user ID from authentication context
  const currentUserId = 'user123'; // Placeholder
  
  const { data, loading, error } = useQuery(GET_USER_CONVERSATIONS, {
    variables: { userId: currentUserId }
  });

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>Error loading conversations</p>
        <p className="text-sm text-gray-500">{error.message}</p>
      </div>
    );
  }

  const conversations: Conversation[] = data?.getUserConversations || [];

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="text-3xl mb-2">📭</div>
        <p>No conversations yet</p>
        <p className="text-sm text-gray-400">Start messaging by visiting a listing</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isSelected={selectedConversationId === conversation.id}
          onClick={() => onConversationSelect(conversation.id)}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
  currentUserId: string;
}

function ConversationItem({ conversation, isSelected, onClick, currentUserId }: ConversationItemProps) {
  // Get the other participant (not the current user)
  const otherParticipant = conversation.participants.find(p => p !== currentUserId) || 'Unknown';
  
  // Format the time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div
      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
        isSelected ? 'bg-blue-50 border-blue-200' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        {/* User Avatar */}
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-600 font-medium">
            {otherParticipant.charAt(0).toUpperCase()}
          </span>
        </div>
        
        {/* Conversation Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {otherParticipant}
            </h3>
            <span className="text-xs text-gray-500">
              {formatTime(conversation.updatedAt)}
            </span>
          </div>
          <p className="text-sm text-gray-500 truncate">
            Listing: {conversation.listingId}
          </p>
          <div className="flex items-center mt-1">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-xs text-gray-400">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}