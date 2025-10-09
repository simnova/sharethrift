import { List, Avatar, Empty, Tag } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import type { Conversation } from "../../../../../generated.tsx";

interface ConversationListProps {
  onConversationSelect: (conversationId: string) => void;
  selectedConversationId: string | null;
  conversations: Conversation[];
}

export const ConversationList: React.FC<ConversationListProps> = (props) => {
    
  const {
    onConversationSelect,
    selectedConversationId,
    conversations
  } = props;

  if (!conversations || conversations.length === 0) {
    return (
      <Empty description="No conversations yet" style={{ marginTop: 32 }} />
    );
  }

  return (
    <div
      style={{
        height: "100%",
        background: "var(--color-background)",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minWidth: 0,
      }}
    >
      <div style={{ padding: "20px 20px 8px 20px" }}>
        <h3
          style={{
            margin: 0,
            fontFamily: "var(--Urbanist)",
            fontWeight: 700,
            fontSize: 20,
            color: "var(--color-primary)",
          }}
        >
          Inbox
        </h3>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={conversations}
        style={{
          flex: 1,
          overflowY: "auto",
          background: "var(--color-background)",
        }}
        renderItem={(conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isSelected={selectedConversationId === conversation.id}
            onClick={() => onConversationSelect(conversation.id)}
          />
        )}
      />
    </div>
  );
};

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

function ConversationItem({
  conversation,
  isSelected,
  onClick,
}: ConversationItemProps) {
  const otherParticipant =
    conversation?.sharer?.account?.profile?.firstName ||
    conversation?.reserver?.account?.profile?.firstName ||
    "Unknown";
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  return (
    <List.Item
      style={{
        background: isSelected ? "var(--color-background-2)" : undefined,
        cursor: "pointer",
        padding: "16px 20px",
      }}
      onClick={onClick}
    >
      <List.Item.Meta
        avatar={
          <Avatar
            style={{
              backgroundColor: "var(--color-foreground-2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            size={32}
            icon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 29 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: "block", margin: "auto" }}
              >
                <title>Sharethrift Logo</title>
                <path
                  d="M13.5528 28C12.6493 28 11.7389 27.8973 10.8217 27.692C9.9045 27.4866 8.96675 27.1923 8.00848 26.809C8.33703 23.4961 9.29531 20.4022 10.8833 17.5274C12.4713 14.6525 14.5111 12.1199 17.0026 9.9296C13.9909 11.4628 11.383 13.4889 9.17894 16.0078C6.9749 18.5267 5.43481 21.4016 4.55867 24.6323C4.44915 24.5502 4.34648 24.4612 4.25065 24.3654L3.94263 24.0574C2.6558 22.7705 1.67699 21.3331 1.00619 19.7451C0.335398 18.1571 0 16.5007 0 14.7758C0 12.914 0.369622 11.1343 1.10887 9.43677C1.84811 7.73924 2.87484 6.23338 4.18905 4.91917C6.10561 3.00261 8.48077 1.66102 11.3145 0.894394C14.1483 0.127771 17.9746 -0.146023 22.7934 0.0730117C23.5052 0.100391 24.1623 0.257823 24.7647 0.545306C25.367 0.83279 25.9009 1.20926 26.3664 1.67471C26.8318 2.14016 27.2014 2.6809 27.4752 3.29694C27.749 3.91297 27.9133 4.57692 27.9681 5.28879C28.1323 10.2171 27.8449 14.0639 27.1056 16.8292C26.3664 19.5945 25.0522 21.9218 23.163 23.811C21.8214 25.1525 20.3224 26.1861 18.6659 26.9117C17.0095 27.6372 15.3051 28 13.5528 28Z"
                  fill="var(--color-foreground-1)"
                />
              </svg>
            }
          />
        }
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h4 style={{ margin: 0, fontWeight: 600 }}>{otherParticipant}</h4>
              <Tag className="sharerIcon">
                <SwapOutlined
                  style={{ color: "var(--color-background)", fontSize: 16 }}
                />
              </Tag>
            </div>
            <p
              style={{
                margin: 0,
                color: "var(--color-foreground-1)",
                fontSize: 12,
                whiteSpace: "nowrap",
              }}
            >
              {formatTime(conversation.updatedAt)}
            </p>
          </div>
        }
        description={
          <>
            <p
              style={{
                margin: 0,
                marginBottom: 8,
                color: "var(--color-message-text)",
              }}
            >
              Listing: {conversation?.listing?.title}
            </p>
            <Tag className="activeTag">Active</Tag>
          </>
        }
      />
    </List.Item>
  );
}
