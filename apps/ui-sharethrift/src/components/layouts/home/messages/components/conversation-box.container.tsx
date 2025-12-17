import { useMutation, useQuery } from '@apollo/client/react';
import { ComponentQueryLoader } from '@sthrift/ui-components';
import { message as antdMessage } from 'antd';
import { useCallback } from 'react';
import {
	type Conversation,
	ConversationBoxContainerConversationDocument,
	ConversationBoxContainerSendMessageDocument,
} from '../../../../../generated.tsx';
import { useUserId } from '../../../../shared/user-context.tsx';
import { ConversationBox } from './conversation-box.tsx';

interface ConversationBoxContainerProps {
	selectedConversationId: string;
}

export const ConversationBoxContainer: React.FC<
	ConversationBoxContainerProps
> = (props) => {
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
			update: (cache, { data }, { variables }) => {
				// Guard against missing or invalid sendMessage payload
				if (!data?.sendMessage?.status?.success || !data.sendMessage.message) {
					return;
				}

				// Use variables from mutation call instead of props closure to avoid stale reference
				const conversationId = variables?.input?.conversationId;
				if (!conversationId) return;

				// Update Apollo cache instead of refetch to avoid unnecessary network round-trip
				const existingConversation = cache.readQuery({
					query: ConversationBoxContainerConversationDocument,
					variables: { conversationId },
				});

				if (existingConversation?.conversation) {
					cache.writeQuery({
						query: ConversationBoxContainerConversationDocument,
						variables: { conversationId },
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
			},
			onCompleted: (data) => {
				// Guard against missing status before accessing nested properties
				if (!data?.sendMessage?.status) {
					return;
				}

				if (!data.sendMessage.status.success) {
					antdMessage.error(
						data.sendMessage.status.errorMessage || 'Failed to send message',
					);
				}
			},
			onError: (error) => {
				antdMessage.error(error.message || 'Failed to send message');
			},
		},
	);

	const handleSendMessage = useCallback(
		async (content: string): Promise<boolean> => {
			if (!content.trim()) return false;

			try {
				const result = await sendMessageMutation({
					variables: {
						input: {
							conversationId: props.selectedConversationId,
							content: content.trim(),
						},
					},
				});

				// Return whether the message was successfully sent
				return result.data?.sendMessage?.status?.success ?? false;
			} catch {
				// Network errors are already handled by onError callback
				// Return false to indicate failure so input is not cleared
				return false;
			}
		},
		[props.selectedConversationId, sendMessageMutation],
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
