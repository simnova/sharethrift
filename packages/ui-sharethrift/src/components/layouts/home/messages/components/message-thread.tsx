import { List, Avatar, Input, Button, Spin, Empty, message as antdMessage, Typography } from 'antd';
import { UserOutlined, SendOutlined } from '@ant-design/icons';

interface Message {
  id: string;
  twilioMessageSid: string;
  conversationId: string;
  authorId: string;
  content: string;
  createdAt: string;
}


interface MessageThreadProps {
  conversationId: string;
  messages: Message[];
  loading: boolean;
  error?: unknown;
  messageText: string;
  setMessageText: (text: string) => void;
  sendingMessage: boolean;
  handleSendMessage: (e: React.FormEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  currentUserId: string;
}

export function MessageThread({ messages, loading, error, messageText, setMessageText, sendingMessage, handleSendMessage, messagesEndRef, currentUserId }: MessageThreadProps) {
  if (loading) {
    return <Spin style={{ width: '100%', marginTop: 32 }} tip="Loading messages..." />;
  }
  if (error) {
    antdMessage.error('Error loading messages');
    return <Empty description="Failed to load messages" style={{ marginTop: 32 }} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: '#f5f5f5' }}>
        {messages.length === 0 ? (
          <Empty description="No messages yet" style={{ marginTop: 32 }} />
        ) : (
          <List
            dataSource={messages}
            renderItem={(message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.authorId === currentUserId}
                showAvatar={index === 0 || messages[index - 1].authorId !== message.authorId}
              />
            )}
          />
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Message Input */}
      <div style={{ padding: 16, background: '#fff', borderTop: '1px solid #f0f0f0' }}>
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 8 }}>
          <Input
            value={messageText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            disabled={sendingMessage}
            onPressEnter={handleSendMessage}
            style={{ flex: 1 }}
            autoComplete="off"
          />
          <Button
            type="primary"
            htmlType="submit"
            icon={<SendOutlined />}
            loading={sendingMessage}
            disabled={!messageText.trim()}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
}

function MessageBubble({ message, isOwn, showAvatar }: MessageBubbleProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };
  return (
    <div style={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
      <div style={{ display: 'flex', flexDirection: isOwn ? 'row-reverse' : 'row', gap: 8, maxWidth: 400 }}>
        {showAvatar && !isOwn && (
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#bfbfbf', flexShrink: 0 }} size={32}>
            {message.authorId.charAt(0).toUpperCase()}
          </Avatar>
        )}
        {showAvatar && isOwn && <div style={{ width: 32 }} />}
        {!showAvatar && <div style={{ width: 32 }} />}
        <div
          style={{
            background: isOwn ? '#1677ff' : '#fff',
            color: isOwn ? '#fff' : '#222',
            borderRadius: 16,
            padding: '8px 16px',
            border: isOwn ? 'none' : '1px solid #f0f0f0',
            minWidth: 60,
            maxWidth: 320,
            wordBreak: 'break-word',
          }}
        >
          <Typography.Text style={{ color: isOwn ? '#fff' : undefined }}>{message.content}</Typography.Text>
          <div style={{ fontSize: 10, color: isOwn ? '#e6f4ff' : '#888', marginTop: 4, textAlign: isOwn ? 'right' : 'left' }}>
            {formatTime(message.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
}