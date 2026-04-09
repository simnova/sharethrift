import { useMutation, useQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { SharerInformationContainerDocument, CreateConversationDocument,
HomeConversationListContainerConversationsByUserDocument,
type CreateConversationMutation, type CreateConversationMutationVariables } from '../../../../../../../generated.tsx';
import { SharerInformation } from '@sthrift/ui-shared';

interface SharerInformationContainerProps {
	sharerId: string;
	listingId: string;
	isOwner?: boolean;
	sharedTimeAgo?: string;
	className?: string;
	showIconOnly?: boolean;
	currentUserId?: string | null;
}

export const SharerInformationContainer: React.FC<
	SharerInformationContainerProps
> = ({ sharerId, listingId, isOwner, sharedTimeAgo, className, currentUserId }) => {
	const navigate = useNavigate();
	const { data, loading, error } = useQuery(
		SharerInformationContainerDocument,
		{
			variables: { sharerId },
		},
	);

	const [createConversation, { loading: isCreating }] = useMutation<
		CreateConversationMutation,
		CreateConversationMutationVariables
	>(CreateConversationDocument, {
		refetchQueries: [
			{
				query: HomeConversationListContainerConversationsByUserDocument,
				variables: { userId: currentUserId },
			}
		],
		awaitRefetchQueries: true,
		onCompleted: (data) => {
			if (data.createConversation.status.success) {
				navigate('/messages', {
					state: {
						selectedConversationId: data.createConversation.conversation?.id,
					},
					replace: false,
				});
			} else {
				console.log('Failed to create conversation:', data.createConversation.status.errorMessage);
			}
		},
		onError: (error) => {
			console.error('Error creating conversation:', error);
		},
	});

	const handleMessageSharer = async (sharerIdForConversation: string) => {
		if (!currentUserId) return;
		try {
			await createConversation({
				variables: {
					input: {
						listingId,
						sharerId: sharerIdForConversation,
						reserverId: currentUserId,
					},
				},
			});
		} catch (error) {
			console.error('Failed to create conversation:', error);
		}
	};

	const isNameOnly =
		typeof sharerId === 'string' &&
		(sharerId.includes(' ') || /^[a-zA-Z\s]+$/.test(sharerId));

	if (isNameOnly) {
		const sharer = {
			id: sharerId,
			name: sharerId,
		};
		return (
			<SharerInformation
				sharer={sharer}
				isOwner={isOwner}
				sharedTimeAgo={sharedTimeAgo}
				className={className}
				currentUserId={currentUserId}
				onMessageSharer={() => handleMessageSharer(sharerId)}
				isMessageLoading={isCreating}
			/>
		);
	}

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error loading sharer information</div>;
	if (!data?.personalUserById) return null;

	const firstName = data.personalUserById.account?.profile?.firstName ?? '';
	const lastName = data.personalUserById.account?.profile?.lastName ?? '';

	const sharer = {
		id: data.personalUserById.id,
		name: `${firstName} ${lastName}`.trim(),
	};

	return (
		<SharerInformation
			sharer={sharer}
			isOwner={isOwner}
			sharedTimeAgo={sharedTimeAgo}
			className={className}
			currentUserId={currentUserId}
			onMessageSharer={() => handleMessageSharer(sharer.id)}
			isMessageLoading={isCreating}
		/>
	);
};
