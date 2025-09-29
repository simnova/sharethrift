import type { Conversation } from "../../../../../generated.tsx";
import { ListingBanner } from "./listing-banner.tsx";
import { MessageThread } from "./index.ts";

interface ConversationBoxProps {
  data: Conversation;
}

export function ConversationBox({ data }: ConversationBoxProps) {

  const currentUserId = data?.sharer?.id;


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
          messageText={"messageText"}
          setMessageText={() => {}}
          sendingMessage={false}
          handleSendMessage={() => {}}
          messagesEndRef={null}
          currentUserId={currentUserId}
          contentContainerStyle={{ paddingLeft: 24 }}
        />
      </div>
    </>
  );
}
