import { List, Avatar, Spin, Empty, Typography, message as antdMessage } from 'antd';
import { UserOutlined } from '@ant-design/icons';

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
  conversations: Conversation[];
  loading?: boolean;
  error?: unknown;
}

export function ConversationList({ onConversationSelect, selectedConversationId, conversations, loading, error }: ConversationListProps) {
  // TODO: Get actual user ID from authentication context
  const currentUserId = 'user123'; // Placeholder

  if (loading) {
    return <Spin style={{ width: '100%', marginTop: 32 }} tip="Loading conversations..." />;
  }
  if (error) {
    antdMessage.error('Error loading conversations');
    return <Empty description="Failed to load conversations" style={{ marginTop: 32 }} />;
  }

  if (!conversations || conversations.length === 0) {
    return <Empty description="No conversations yet" style={{ marginTop: 32 }} />;
  }

  return (
    <List
      itemLayout="horizontal"
      dataSource={conversations}
      style={{ height: '100%', overflowY: 'auto' }}
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
      style={{ background: isSelected ? '#e6f4ff' : undefined, cursor: 'pointer' }}
      onClick={onClick}
      extra={<Typography.Text type="secondary" style={{ fontSize: 12 }}>{formatTime(conversation.updatedAt)}</Typography.Text>}
    >
      <List.Item.Meta
        avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: '#bfbfbf' }}>{otherParticipant.charAt(0).toUpperCase()}</Avatar>}
        title={<Typography.Text strong ellipsis>{otherParticipant}</Typography.Text>}
        description={<>
          <Typography.Text type="secondary" ellipsis>Listing: {conversation.listingId}</Typography.Text>
          <div><Typography.Text type="success" style={{ fontSize: 10 }}>Active</Typography.Text></div>
        </>}
      />
    </List.Item>
  );
}