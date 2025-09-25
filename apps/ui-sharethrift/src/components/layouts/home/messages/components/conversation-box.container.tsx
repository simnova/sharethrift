import { ComponentQueryLoader } from "@sthrift/ui-components";

import { ConversationBox } from "./conversation-box.tsx";

interface ConversationBoxContainerProps {
  selectedConversationId: string;
}   

export function ConversationBoxContainer({
  selectedConversationId
}: ConversationBoxContainerProps) {
    console.log("Selected conversation ID in container------>:", selectedConversationId);
  return (
    <ComponentQueryLoader
      loading={false}
      hasData={{}}
      hasDataComponent={<ConversationBox />}
    />
  );
}
