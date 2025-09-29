import type { Conversation } from "../../../../../generated.tsx";
import { ListingBanner } from "./listing-banner.tsx";
import { MessageThread } from "./index.ts";
import { useState } from "react";

interface ConversationBoxProps {
  data: Conversation;
}

export function ConversationBox({ data }: ConversationBoxProps) {
  const currentUserId = data?.sharer?.id;

  const [messageText, setMessageText] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Send message logic to be implemented", messageText);
  };

  return (
    <>
      {(() => {
        const owner = data?.sharer;
        return true ? (
          <div style={{ marginBottom: 24 }}>
            <ListingBanner owner={owner} />
          </div>
        ) : null;
      })()}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MessageThread
          conversationId={data.id}
          messages={data.messages || []}
          loading={false}
          error={null}
          sendingMessage={false}
          messageText={messageText}
          setMessageText={setMessageText}
          handleSendMessage={handleSendMessage}
          currentUserId={currentUserId}
          contentContainerStyle={{ paddingLeft: 24 }}
        />
      </div>
    </>
  );
}
