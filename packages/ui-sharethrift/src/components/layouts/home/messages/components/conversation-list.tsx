import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { List, Avatar, Spin, Empty, Typography, message as antdMessage } from 'antd';
import { UserOutlined } from '@ant-design/icons';

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
  __storybookMockData?: Conversation[];
}

  // TODO: Get actual user ID from authentication context
  const currentUserId = 'user123'; // Placeholder
  const isMock = !!__storybookMockData;
  const { data, loading, error } = useQuery(GET_USER_CONVERSATIONS, {
    variables: { userId: currentUserId },
    skip: isMock,
  });
  const conversations: Conversation[] = isMock
    ? __storybookMockData || []
    : data?.getUserConversations || [];

  if (loading && !isMock) {
    return <Spin style={{ width: '100%', marginTop: 32, fontFamily: 'var(--Urbanist, Arial, sans-serif)' }} tip="Loading conversations..." />;
  }
  if (error && !isMock) {
    antdMessage.error('Error loading conversations');
    return <Empty description="Failed to load conversations" style={{ marginTop: 32, fontFamily: 'var(--Urbanist, Arial, sans-serif)' }} />;
  }
  if (conversations.length === 0) {
    return <Empty description="No conversations yet" style={{ marginTop: 32, fontFamily: 'var(--Urbanist, Arial, sans-serif)' }} />;
  }
  return (
    <List
      itemLayout="horizontal"
      dataSource={conversations}
      style={{ height: '100%', overflowY: 'auto', background: 'var(--color-background)' }}
      renderItem={conversation => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isSelected={selectedConversationId === conversation.id}
          onClick={() => onConversationSelect(conversation.id)}
          currentUserId={currentUserId}
        />
      )}
    />
  );
}

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
  currentUserId: string;
}

function ConversationItem({ conversation, isSelected, onClick, currentUserId }: ConversationItemProps) {
  const otherParticipant = conversation.participants.find(p => p !== currentUserId) || 'Unknown';
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };
  return (
    <List.Item
      style={{
        background: isSelected ? 'var(--color-foreground-2, #DED7BF)' : 'var(--color-background, #FEFDFA)',
        cursor: 'pointer',
        fontFamily: 'var(--Urbanist, Arial, sans-serif)',
        color: 'var(--color-message-text, #333333)',
      }}
      onClick={onClick}
      extra={<Typography.Text type="secondary" style={{ fontSize: 12 }}>{formatTime(conversation.updatedAt)}</Typography.Text>}
    >
      <List.Item.Meta
        avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: 'var(--color-foreground-1, #C4BEA9)' }}>{otherParticipant.charAt(0).toUpperCase()}</Avatar>}
        title={<Typography.Text strong ellipsis style={{ fontFamily: 'var(--Urbanist, Arial, sans-serif)' }}>{otherParticipant}</Typography.Text>}
        description={<>
          <Typography.Text type="secondary" ellipsis style={{ fontFamily: 'var(--Urbanist, Arial, sans-serif)' }}>Listing: {conversation.listingId}</Typography.Text>
          <div><Typography.Text type="success" style={{ fontSize: 10 }}>Active</Typography.Text></div>
        </>}
      />
    </List.Item>
  );
}