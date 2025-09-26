import { ListingBannerContainer } from "./listing-banner.container.tsx";

// const mockConversations = {
//   "1": [
//     {
//       id: "m1",
//       twilioMessageSid: "SM1",
//       conversationId: "1",
//       authorId: "user123",
//       content: "Hey Alice, is the bike still available?",
//       createdAt: "2025-08-08T12:01:00Z",
//     },
//     {
//       id: "m2",
//       twilioMessageSid: "SM2",
//       conversationId: "1",
//       authorId: "Alice",
//       content: "Yes, it is! Do you want to see it?",
//       createdAt: "2025-08-08T12:02:00Z",
//     },
//   ],
//   "2": [
//     {
//       id: "m3",
//       twilioMessageSid: "SM3",
//       conversationId: "2",
//       authorId: "user123",
//       content: "Hi Bob, is the camera in good condition?",
//       createdAt: "2025-08-08T11:31:00Z",
//     },
//     {
//       id: "m4",
//       twilioMessageSid: "SM4",
//       conversationId: "2",
//       authorId: "Bob",
//       content: "Absolutely, barely used.",
//       createdAt: "2025-08-08T11:32:00Z",
//     },
//   ],
//   "3": [
//     {
//       id: "m5",
//       twilioMessageSid: "SM5",
//       conversationId: "3",
//       authorId: "Carol",
//       content: "Tent is available for this weekend.",
//       createdAt: "2025-08-08T10:46:00Z",
//     },
//   ],
// };

interface ConversationBoxProps {}

export function ConversationBox({}: ConversationBoxProps) {
  return (
    <>
      {/* Banner at the top */}
      {(() => {
        // const conv = mockConversations.find((c) => c.id === "1");
        const owner = "Unknown";
        // const owner = conv?.participants.find((p) => p !== currentUserId) || "Unknown";
        return true ? (
          <div style={{ marginBottom: 24 }}>
            <ListingBannerContainer listingId={"1"} owner={owner} />
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
        {/* <MessageThread
          conversationId={selectedConversationId}
          messages={messagesMap[selectedConversationId] || []}
          loading={false}
          error={null}
          messageText={messageText}
          setMessageText={setMessageText}
          sendingMessage={sendingMessage}
          handleSendMessage={handleSendMessage}
          messagesEndRef={messagesEndRef}
          currentUserId={currentUserId}
          contentContainerStyle={{ paddingLeft: 24 }}
        /> */}
      </div>
    </>
  );
}
