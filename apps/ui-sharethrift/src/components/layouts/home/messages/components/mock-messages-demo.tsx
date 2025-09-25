// import { useState, useRef, useEffect } from "react";
import { useState, useEffect } from "react";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { ConversationListContainer } from "./conversation-list.container.tsx";
import { ConversationBoxContainer } from "./conversation-box.container.tsx";

// Types
interface Conversation {
  id: string;
  twilioConversationSid: string;
  listingId: string;
  participants: string[];
  createdAt: string;
  updatedAt: string;
}

// Mock data for conversations
const mockConversations: Conversation[] = [
  {
    id: "1",
    twilioConversationSid: "CH123",
    listingId: "Bike-001",
    participants: ["user123", "Alice"],
    createdAt: "2025-08-08T10:00:00Z",
    updatedAt: "2025-08-08T12:00:00Z",
  },
  {
    id: "2",
    twilioConversationSid: "CH124",
    listingId: "Camera-002",
    participants: ["user123", "Bob"],
    createdAt: "2025-08-07T09:00:00Z",
    updatedAt: "2025-08-08T11:30:00Z",
  },
  {
    id: "3",
    twilioConversationSid: "CH125",
    listingId: "Tent-003",
    participants: ["user123", "Carol"],
    createdAt: "2025-08-06T08:00:00Z",
    updatedAt: "2025-08-08T10:45:00Z",
  },
];



export function MockMessagesDemo() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(mockConversations[0]?.id || null);
//   const [messagesMap, setMessagesMap] =
//     useState<Record<string, Message[]>>(initialMessages);
  const [isMobile, setIsMobile] = useState(false);
  const [showListOnMobile, setShowListOnMobile] = useState(true);
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Detect mobile screen
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 576px)");
    const handleResize = () => setIsMobile(mq.matches);
    handleResize();
    mq.addEventListener("change", handleResize);
    return () => mq.removeEventListener("change", handleResize);
  }, []);

  // When switching to desktop, always show both
  useEffect(() => {
    if (!isMobile) {
        setShowListOnMobile(true);
    }
  }, [isMobile]);

  // Scroll to bottom when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     // Only depend on messages for the selected conversation
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [messagesMap[selectedConversationId ?? ""]]);

  const handleConversationSelect = (id: string) => {
    setSelectedConversationId(id);

    if (isMobile) {
        setShowListOnMobile(false)
    };
  };

//   const handleSendMessage = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!messageText.trim() || !selectedConversationId) return;
//     setSendingMessage(true);
//     setTimeout(() => {
//       setMessagesMap((prev) => {
//         const newMsg: Message = {
//           id: `m${Date.now()}`,
//           twilioMessageSid: `SM${Date.now()}`,
//           conversationId: selectedConversationId,
//           authorId: currentUserId,
//           content: messageText.trim(),
//           createdAt: new Date().toISOString(),
//         };
//         return {
//           ...prev,
//           [selectedConversationId]: [
//             ...(prev[selectedConversationId] || []),
//             newMsg,
//           ],
//         };
//       });
//       setMessageText("");
//       setSendingMessage(false);
//     }, 300); // Simulate network delay
//   };

  // Responsive layout
  if (isMobile) {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          minHeight: 0,
          minWidth: 0,
          overflow: "hidden",
          background: "var(--color-background)",
        }}
      >
        {showListOnMobile ? (
          <div style={{ width: "100%", height: "100%" }}>
            <ConversationListContainer
              onConversationSelect={handleConversationSelect}
            />
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              background: "#f5f5f5",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: 48,
                background: "var(--color-background-2)",
                borderBottom: "1px solid var(--color-foreground-2)",
              }}
            >
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => setShowListOnMobile(true)}
                style={{ marginLeft: 8, fontSize: 20 }}
              />
              <span
                style={{
                  fontWeight: 600,
                  fontFamily: "var(--Urbanist)",
                  fontSize: 16,
                  marginLeft: 8,
                }}
              >
                Conversation
              </span>
            </div>

            {selectedConversationId ? (
              <ConversationBoxContainer
                selectedConversationId={selectedConversationId}
              />
            ) : (
              <div style={{ padding: 32, textAlign: "center", color: "#888" }}>
                Select a conversation to start messaging.
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Desktop layout (unchanged)
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        minHeight: 0,
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      {/* Conversation List */}
      <div
        style={{
          width: "clamp(220px, 28vw, 340px)",
          minWidth: 180,
          maxWidth: 400,
          borderRight: "1px solid var(--color-foreground-2)",
        }}
      >
        <ConversationListContainer
          onConversationSelect={handleConversationSelect}
        />
      </div>
      {/* Message Thread with Listing Banner */}
      <div
        style={{
          flex: 1,
          background: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {selectedConversationId ? (
          <ConversationBoxContainer
            selectedConversationId={selectedConversationId}
          />
        ) : (
          <div style={{ padding: 32, textAlign: "center", color: "#888" }}>
            Select a conversation to start messaging.
          </div>
        )}
      </div>
    </div>
  );
}
