import { ConversationList } from './conversation-list.tsx';
import { useQuery } from '@apollo/client/react';
import {
	HomeConversationListContainerConversationsByUserDocument,
	type Conversation,
} from '../../../../../generated.tsx';
import { ComponentQueryLoader } from '@sthrift/ui-components';
import { useEffect } from 'react';
import { Empty } from 'antd';

interface ConversationListContainerProps {
	onConversationSelect: (conversationId: string) => void;
	selectedConversationId: string | null;
}

export const ConversationListContainer: React.FC<
	ConversationListContainerProps
> = (props) => {
	// TODO: Replace with actual authenticated user ID
	// This should come from authentication context
	const currentUserId = '507f1f77bcf86cd799439099';

	const {
		data: currentUserConversationsData,
		loading: loadingConversations,
		error: conversationsError,
	} = useQuery(HomeConversationListContainerConversationsByUserDocument, {
		variables: {
			userId: currentUserId,
		},
	});

	useEffect(() => {
		if (
			!props.selectedConversationId &&
			currentUserConversationsData?.conversationsByUser?.[0]?.id
		) {
			props.onConversationSelect(
				currentUserConversationsData.conversationsByUser[0].id,
			);
		}
	}, [
		currentUserConversationsData,
		props.selectedConversationId,
		props.onConversationSelect,
	]);

	return (
		<ComponentQueryLoader
			loading={loadingConversations}
			hasData={currentUserConversationsData}
			error={conversationsError}
			noDataComponent={
				<Empty description="No conversations yet" style={{ marginTop: 32 }} />
			}
			hasDataComponent={
				<ConversationList
					onConversationSelect={props.onConversationSelect}
					selectedConversationId={props.selectedConversationId}
					conversations={
						currentUserConversationsData?.conversationsByUser as Conversation[]
					}
				/>
			}
		/>
	);
};
