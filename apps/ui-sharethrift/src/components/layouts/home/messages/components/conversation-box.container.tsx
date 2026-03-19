import { ComponentQueryLoader } from "@sthrift/ui-components";
import { ConversationBox } from "./conversation-box.tsx";
import {
  ConversationBoxContainerConversationDocument,
  type Conversation,
} from "../../../../../generated.tsx";
import { useQuery } from "@apollo/client/react";

interface ConversationBoxContainerProps {
  selectedConversationId: string;
}

export const ConversationBoxContainer: React.FC<ConversationBoxContainerProps> = (props) => {
  const {
    data: currentUserConversationsData,
    loading: loadingConversations,
    error: conversationsError,
  } = useQuery(ConversationBoxContainerConversationDocument, {
    variables: {
      conversationId: props.selectedConversationId,
    },
  });

  return (
    <ComponentQueryLoader
      loading={loadingConversations}
      hasData={currentUserConversationsData}
      error={conversationsError}
      hasDataComponent={
        <ConversationBox
          data={currentUserConversationsData?.conversation as Conversation}
        />
      }
    />
  );
};
