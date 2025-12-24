import { List, Input, Button, Spin, Empty, message as antdMessage } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useRef, useCallback } from "react";
import { UserAvatar } from "../../../../shared/user-avatar.tsx";

interface Message {
  id: string;
  messagingMessageId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

interface UserInfo {
  id: string;
  displayName: string;
}

interface MessageThreadProps {
  conversationId: string;
  messages: Message[];
  loading: boolean;
  error?: unknown;
  sendingMessage: boolean;
  messageText: string;
  setMessageText: (text: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  currentUserId: string;
  contentContainerStyle?: React.CSSProperties;
  sharer: UserInfo;
  reserver: UserInfo;
}

export const MessageThread: React.FC<MessageThreadProps> = (props) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Helper to get display name for a given authorId - memoized for performance
  const getAuthorDisplayName = useCallback((authorId: string): string => {
    if (props.sharer.id === authorId) {
      return props.sharer.displayName || "Sharer";
    }
    if (props.reserver.id === authorId) {
      return props.reserver.displayName || "Reserver";
    }
    return "User";
  }, [props.sharer, props.reserver]);

  if (props.loading) {
    return (
      <Spin
        style={{
          width: "100%",
          marginTop: 32,
          fontFamily: "var(--Urbanist, Arial, sans-serif)",
        }}
        tip="Loading messages..."
      />
    );
  }
  if (props.error) {
    antdMessage.error("Error loading messages");
    return (
      <Empty
        description="Failed to load messages"
        style={{
          marginTop: 32,
          fontFamily: "var(--Urbanist, Arial, sans-serif)",
        }}
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        fontFamily: "var(--Urbanist, Arial, sans-serif)",
      }}
    >
      {/* Messages Area */}
      <div
        style={{
          flex: 1,
          width: "100%",
          overflowY: "auto",
          background: "#f5f5f5",
        }}
      >
        <div
          style={{
            paddingLeft: 24,
            fontFamily: "var(--Urbanist, Arial, sans-serif)",
          }}
        >
          {props.messages.length === 0 ? (
            <Empty
              description="No messages yet"
              style={{
                marginTop: 32,
                fontFamily: "var(--Urbanist, Arial, sans-serif)",
              }}
            />
          ) : (
            <List
              dataSource={props.messages}
              renderItem={(message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.authorId === props.currentUserId}
                  showAvatar={
                    index === 0 ||
                    (index > 0 &&
                      props.messages[index - 1]?.authorId !== message.authorId)
                  }
                  authorDisplayName={getAuthorDisplayName(message.authorId)}
                />
              )}
            />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Message Input */}
      <div
        style={{
          padding: 16,
          background: "#fff",
          borderTop: "1px solid #f0f0f0",
          fontFamily: "var(--Urbanist, Arial, sans-serif)",
        }}
      >
        <form
          onSubmit={props.handleSendMessage}
          style={{
            display: "flex",
            gap: 8,
            fontFamily: "var(--Urbanist, Arial, sans-serif)",
          }}
        >
          <Input
            value={props.messageText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              props.setMessageText(e.target.value)
            }
            placeholder="Type a message..."
            disabled={props.sendingMessage}
            onPressEnter={props.handleSendMessage}
            style={{
              flex: 1,
              fontFamily: "var(--Urbanist, Arial, sans-serif)",
            }}
            autoComplete="off"
          />
          <Button
            type="primary"
            htmlType="submit"
            icon={<SendOutlined />}
            loading={props.sendingMessage}
            disabled={!props.messageText.trim()}
            style={{ fontFamily: "var(--Urbanist, Arial, sans-serif)" }}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
  authorDisplayName: string;
}

function MessageBubble({ message, isOwn, showAvatar, authorDisplayName }: MessageBubbleProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isOwn ? "flex-end" : "flex-start",
        marginBottom: 8,
        fontFamily: "var(--Urbanist, Arial, sans-serif)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isOwn ? "row-reverse" : "row",
          gap: 8,
          maxWidth: 400,
          fontFamily: "var(--Urbanist, Arial, sans-serif)",
        }}
      >
        {showAvatar && !isOwn && (
          <UserAvatar userId={message.authorId} userName={authorDisplayName} size={32} />
        )}
        {showAvatar && isOwn && <div style={{ width: 32 }} />}
        {!showAvatar && <div style={{ width: 32 }} />}
        <div
          style={{
            background: isOwn ? "var(--color-primary)" : "#fff",
            color: isOwn
              ? "var(--color-highlight)"
              : "var(--color-message-text)",
            borderRadius: 16,
            padding: "8px 16px",
            border: isOwn ? "none" : "1px solid var(--color-foreground-2)",
            minWidth: 60,
            maxWidth: 320,
            wordBreak: "break-word",
            fontFamily: "var(--Urbanist, Arial, sans-serif)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: isOwn
                ? "var(--color-highlight)"
                : "var(--color-message-text)",
              fontFamily: "var(--Urbanist, Arial, sans-serif)",
            }}
          >
            {message.content}
          </p>
          <div
            style={{
              fontSize: 10,
              color: isOwn
                ? "var(--color-highlight)"
                : "var(--color-foreground-1)",
              marginTop: 4,
              textAlign: isOwn ? "right" : "left",
              fontFamily: "var(--Urbanist, Arial, sans-serif)",
            }}
          >
            {formatTime(message.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
}
