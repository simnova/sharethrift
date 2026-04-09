import { Messages as SharedMessages } from "@sthrift/ui-components";
import { ConversationListContainer } from "./conversation-list.container.tsx";
import { ConversationBoxContainer } from "./conversation-box.container.tsx";

export const Messages: React.FC = () => {
  return (
    <SharedMessages
      ConversationListComponent={ConversationListContainer}
      ConversationBoxComponent={ConversationBoxContainer}
    />
  );
};
