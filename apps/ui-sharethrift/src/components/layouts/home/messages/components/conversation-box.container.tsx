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
  } = useQuery(ConversationBoxContainerConversationDocument, {
    variables: {
      conversationId: props.selectedConversationId,
    },
  });

  const [sendMessageMutation, { loading: sendingMessage }] = useMutation(
    ConversationBoxContainerSendMessageDocument,
    {
      update: (cache, { data }) => {
        if (data?.sendMessage.status.success && data.sendMessage.message) {
          // Update Apollo cache instead of refetch to avoid unnecessary network round-trip
          const existingConversation = cache.readQuery({
            query: ConversationBoxContainerConversationDocument,
            variables: { conversationId: props.selectedConversationId },
          });

          if (existingConversation?.conversation) {
            cache.writeQuery({
              query: ConversationBoxContainerConversationDocument,
              variables: { conversationId: props.selectedConversationId },
              data: {
                conversation: {
                  ...existingConversation.conversation,
                  messages: [
                    ...(existingConversation.conversation.messages || []),
                    data.sendMessage.message,
                  ],
                },
              },
            });
          }
        }
      },
      onCompleted: (data) => {
        if (!data.sendMessage.status.success) {
          antdMessage.error(data.sendMessage.status.errorMessage || "Failed to send message");
        }
      },
      onError: (error) => {
        antdMessage.error(error.message || "Failed to send message");
      },
    }
  );

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      await sendMessageMutation({
        variables: {
          input: {
            conversationId: props.selectedConversationId,
            content: content.trim(),
          },
        },
      });
    },
    [props.selectedConversationId, sendMessageMutation]
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
