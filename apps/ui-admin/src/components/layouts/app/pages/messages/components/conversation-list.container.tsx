import { ConversationList } from './conversation-list.tsx';
import { useQuery } from '@apollo/client/react';
import {
	HomeConversationListContainerCurrentAdminUserDocument,
	HomeConversationListContainerConversationsByUserDocument,
	type Conversation,
} from '../../../../../../generated.tsx';
import { ComponentQueryLoader } from '@sthrift/ui-components';
import { useEffect } from 'react';
import { Empty, Result } from 'antd';

interface ConversationListContainerProps {
	onConversationSelect: (conversationId: string) => void;
	selectedConversationId: string | null;
}

const getFirstErrorMessage = (
	...errors: (Error | undefined | null)[]
): string => {
	return errors.find(Boolean)?.message || 'Unknown error';
};

export const ConversationListContainer: React.FC<
	ConversationListContainerProps
> = (props) => {
	const {
		data: currentAdminUserData,
		loading: currentAdminUserLoading,
		error: currentAdminUserError,
	} = useQuery(HomeConversationListContainerCurrentAdminUserDocument);

	const {
		data: currentUserConversationsData,
		loading: loadingConversations,
		error: conversationsError,
	} = useQuery(HomeConversationListContainerConversationsByUserDocument, {
		variables: {
			userId: currentAdminUserData?.currentAdminUser.id,
		},
		skip: !currentAdminUserData?.currentAdminUser.id,
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

	const errorMessage = getFirstErrorMessage(
		conversationsError,
		currentAdminUserError,
	);

	return (
		<ComponentQueryLoader
			loading={loadingConversations || currentAdminUserLoading}
			hasData={
				currentUserConversationsData?.conversationsByUser &&
				currentAdminUserData?.currentAdminUser
			}
			error={conversationsError || currentAdminUserError}
			errorComponent={
				<Result
					status="error"
					title={errorMessage}
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
