import { useState, useEffect } from "react";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { ConversationListContainer } from "./conversation-list.container.tsx";
import { ConversationBoxContainer } from "./conversation-box.container.tsx";


export function Messages() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showListOnMobile, setShowListOnMobile] = useState(true);

  // Detect mobile screen
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 576px)");
    const handleResize = () => setIsMobile(mq.matches);
    handleResize();
    mq.addEventListener("change", handleResize);
    return () => mq.removeEventListener("change", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
        setShowListOnMobile(true);
    }
  }, [isMobile]);

  const handleConversationSelect = (id: string) => {
    setSelectedConversationId(id);

    if (isMobile) {
        setShowListOnMobile(false)
    };
  };

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
              selectedConversationId={selectedConversationId}
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
          selectedConversationId={selectedConversationId}
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
