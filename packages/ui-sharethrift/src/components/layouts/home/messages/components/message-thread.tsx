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
  __storybookMockData?: Message[];
}

  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // TODO: Get actual user ID from authentication context
  const currentUserId = 'user123'; // Placeholder
  const isMock = !!__storybookMockData;
  // Always call hooks, but only use their results if not in mock mode
  const queryResult = useQuery(GET_CONVERSATION_MESSAGES, {
    variables: { conversationId, limit: 50, offset: 0 },
    pollInterval: 5000,
    skip: isMock,
  });
  const mutationResult = useMutation(SEND_MESSAGE, {
    onCompleted: () => {
      setMessageText('');
      queryResult.refetch && queryResult.refetch();
    },
    onError: (error) => {
      console.error('Error sending message:', error);
    }
  });
  const messages: Message[] = isMock
    ? __storybookMockData || []
    : queryResult.data?.getConversationMessages || [];
  const loading = isMock ? false : queryResult.loading;
  const error = isMock ? null : queryResult.error;
  const [sendMessage, { loading: sendingMessage }] = isMock
    ? [() => {}, { loading: false }]
    : mutationResult;
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || sendingMessage) return;
    if (isMock) {
      setMessageText('');
      return;
    }
    try {
      await sendMessage({
        variables: {
          input: {
            conversationId,
            content: messageText.trim(),
            authorId: currentUserId
          }
        }
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
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
    return <Spin style={{ width: '100%', marginTop: 32, fontFamily: 'var(--Urbanist, Arial, sans-serif)' }} tip="Loading messages..." />;
    return <Spin style={{ width: '100%', marginTop: 32 }} tip="Loading messages..." />;
  }
  if (error) {
    antdMessage.error('Error loading messages');
    return <Empty description="Failed to load messages" style={{ marginTop: 32, fontFamily: 'var(--Urbanist, Arial, sans-serif)' }} />;
    antdMessage.error('Error loading messages');
    return <Empty description="Failed to load messages" style={{ marginTop: 32 }} />;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--Urbanist, Arial, sans-serif)', background: 'var(--color-background, #FEFDFA)' }}>
      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: 'var(--color-background, #FEFDFA)' }}>
      <div style={{ flex: 1, width: '100%', overflowY: 'auto', background: '#f5f5f5' }}>
        {messages.length === 0 ? (
          <Empty description="No messages yet" style={{ marginTop: 32, fontFamily: 'var(--Urbanist, Arial, sans-serif)' }} />
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
      <div style={{ padding: 16, background: 'var(--color-foreground-2, #DED7BF)', borderTop: '1px solid var(--color-foreground-1, #C4BEA9)' }}>
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 8 }}>
          <Input
            value={messageText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            disabled={sendingMessage}
            onPressEnter={handleSendMessage}
            style={{ flex: 1, fontFamily: 'var(--Urbanist, Arial, sans-serif)' }}
            autoComplete="off"
          />
          <Button
            type="primary"
            htmlType="submit"
            icon={<SendOutlined />}
            loading={sendingMessage}
            disabled={!messageText.trim()}
            style={{ background: 'var(--color-primary, #25322C)', border: 'none', fontFamily: 'var(--Urbanist, Arial, sans-serif)' }}
          >
            Send
          </Button>
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
            background: isOwn ? '#25322C' : '#fff',
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