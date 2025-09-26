import { ConversationList } from "./conversation-list.tsx";
import { useQuery } from "@apollo/client";
import {
  HomeConversationListContainerConversationsByUserDocument,
  type Conversation,
} from "../../../../../generated.tsx";
import { ComponentQueryLoader } from "@sthrift/ui-components";

interface ConversationListContainerProps {
  onConversationSelect: (conversationId: string) => void;
}

export function ConversationListContainer({
  onConversationSelect,
}: ConversationListContainerProps) {
  // TODO: Replace with actual authenticated user ID
  // This should come from authentication context
  const currentUserId = "507f1f77bcf86cd799439099";

  const {
    data: currentUserConversationsData,
    loading: loadingConversations,
    error: conversationsError,
  } = useQuery(HomeConversationListContainerConversationsByUserDocument, {
    variables: {
      userId: currentUserId,
    },
  });

  return (
    <ComponentQueryLoader
      loading={loadingConversations}
      hasData={currentUserConversationsData}
      error={conversationsError}
      hasDataComponent={
        <ConversationList
          onConversationSelect={onConversationSelect}
          selectedConversationId={null}
          conversations={
            currentUserConversationsData?.conversationsByUser as Conversation[]
          }
        />
      }
    />
  );
}
