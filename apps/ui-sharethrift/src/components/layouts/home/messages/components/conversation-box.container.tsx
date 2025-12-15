import { ComponentQueryLoader } from "@sthrift/ui-components";
import { ConversationBox } from "./conversation-box.tsx";
import {
  ConversationBoxContainerConversationDocument,
  ConversationBoxContainerSendMessageDocument,
  type Conversation,
} from "../../../../../generated.tsx";
import { useQuery, useMutation } from "@apollo/client/react";
import { useUserId } from "../../../../shared/user-context.tsx";
import { message as antdMessage } from "antd";
import { useCallback } from "react";

interface ConversationBoxContainerProps {
  selectedConversationId: string;
}

export const ConversationBoxContainer: React.FC<ConversationBoxContainerProps> = (props) => {
  const currentUserId = useUserId();
  
  const {
    data: currentUserConversationsData,
    loading: loadingConversations,
    error: conversationsError,
    refetch,
  } = useQuery(ConversationBoxContainerConversationDocument, {
    variables: {
      conversationId: props.selectedConversationId,
    },
  });

  const [sendMessageMutation, { loading: sendingMessage }] = useMutation(
    ConversationBoxContainerSendMessageDocument,
    {
      onCompleted: (data) => {
        if (data.sendMessage.status.success) {
          // Refetch conversation to update messages
          refetch();
        } else {
          antdMessage.error(
            data.sendMessage.status.errorMessage || "Failed to send message"
          );
        }
      },
      onError: (error) => {
        console.error("Send message error:", error);
        antdMessage.error("Failed to send message. Please try again.");
      },
    }
  );

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!currentUserId) {
        antdMessage.error("You must be logged in to send messages");
        return;
      }

      if (!content.trim()) {
        antdMessage.error("Message cannot be empty");
        return;
      }

      if (content.trim().length > 2000) {
        antdMessage.error("Message exceeds maximum length of 2000 characters");
        return;
      }

      await sendMessageMutation({
        variables: {
          input: {
            conversationId: props.selectedConversationId,
            content: content.trim(),
            authorId: currentUserId,
          },
        },
      });
    },
    [currentUserId, props.selectedConversationId, sendMessageMutation]
  );

  return (
    <ComponentQueryLoader
      loading={loadingConversations}
      hasData={currentUserConversationsData}
      error={conversationsError}
      hasDataComponent={
        <ConversationBox
          data={currentUserConversationsData?.conversation as Conversation}
          currentUserId={currentUserId}
          onSendMessage={handleSendMessage}
          sendingMessage={sendingMessage}
        />
      }
    />
  );
};
