import { ConversationList } from './conversation-list.tsx';
import { useQuery } from '@apollo/client/react';
import {
    HomeConversationListContainerCurrentUserDocument,
	HomeConversationListContainerConversationsByUserDocument,
	type Conversation,
} from '../../../../../generated.tsx';
import { ComponentQueryLoader } from '@sthrift/ui-components';
import { useEffect } from 'react';
import { Empty, Result } from 'antd';

interface ConversationListContainerProps {
	onConversationSelect: (conversationId: string) => void;
	selectedConversationId: string | null;
}

export const ConversationListContainer: React.FC<
	ConversationListContainerProps
> = (props) => {
	const {
		data: currentUserData,
		loading: currentUserLoading,
		error: currentUserError,
	} = useQuery(
		HomeConversationListContainerCurrentUserDocument,
	);

	const {
		data: currentUserConversationsData,
		loading: loadingConversations,
		error: conversationsError,
	} = useQuery(HomeConversationListContainerConversationsByUserDocument, {
		variables: {
			userId:
				currentUserData?.currentUser.id,
		},
        skip: !currentUserData?.currentUser.id,
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
        props,
	]);

	return (
		<ComponentQueryLoader
			loading={loadingConversations || currentUserLoading}
			hasData={
				currentUserConversationsData?.conversationsByUser &&
				currentUserData?.currentUser
			}
			error={conversationsError || currentUserError}
			errorComponent={
				<Result
					status="error"
					title={
						conversationsError
							? conversationsError.message
							: currentUserError
								? currentUserError.message
								: 'Unknown error'
					}
				/>
			}
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
