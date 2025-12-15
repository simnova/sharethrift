import type { Conversation } from "../../../../../generated.tsx";
import { ListingBanner } from "./listing-banner.tsx";
import { MessageThread } from "./index.ts";
import { useState } from "react";

interface ConversationBoxProps {
  data: Conversation;
  currentUserId?: string;
  onSendMessage: (content: string) => Promise<void>;
  sendingMessage: boolean;
}

export const ConversationBox: React.FC<ConversationBoxProps> = (props) => {
  const [messageText, setMessageText] = useState("");

  const currentUserId = props.currentUserId ?? props?.data?.sharer?.id;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) {
      return;
    }
    
    try {
      await props.onSendMessage(messageText);
      // Clear the input on success
      setMessageText("");
    } catch (error) {
      // Error handling is done in the container
      console.error("Failed to send message:", error);
    }
  };

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <ListingBanner owner={props.data?.sharer} />
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MessageThread
          conversationId={props.data.id}
          messages={props.data.messages || []}
          loading={false}
          error={null}
          sendingMessage={props.sendingMessage}
          messageText={messageText}
          setMessageText={setMessageText}
          handleSendMessage={handleSendMessage}
          currentUserId={currentUserId}
        />
      </div>
    </>
  );
};
