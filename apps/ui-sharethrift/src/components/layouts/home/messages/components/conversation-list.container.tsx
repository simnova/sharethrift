import { ConversationList } from './conversation-list.tsx';
import { useQuery } from '@apollo/client/react';
import {
	HomeConversationListContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
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
	const {
		data: currentPersonalUserData,
		loading: currentPersonalUserLoading,
		error: currentPersonalUserError,
	} = useQuery(
		HomeConversationListContainerCurrentPersonalUserAndCreateIfNotExistsDocument,
	);

	const {
		data: currentUserConversationsData,
		loading: loadingConversations,
		error: conversationsError,
	} = useQuery(HomeConversationListContainerConversationsByUserDocument, {
		variables: {
			userId:
				currentPersonalUserData?.currentPersonalUserAndCreateIfNotExists.id,
		},
		skip: !currentPersonalUserData?.currentPersonalUserAndCreateIfNotExists.id,
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
			loading={loadingConversations || currentPersonalUserLoading}
			hasData={
				currentUserConversationsData?.conversationsByUser &&
				currentPersonalUserData?.currentPersonalUserAndCreateIfNotExists
			}
			error={conversationsError || currentPersonalUserError}
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
