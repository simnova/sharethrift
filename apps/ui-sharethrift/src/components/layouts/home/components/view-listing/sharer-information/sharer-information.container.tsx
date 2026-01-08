import { useMutation, useQuery } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SharerInformation } from './sharer-information.tsx';
import {
	CreateConversationDocument,
	HomeConversationListContainerConversationsByUserDocument,
	SharerInformationContainerDocument,
} from '../../../../../../generated.tsx';
import type {
	CreateConversationMutation,
	CreateConversationMutationVariables,
} from '../../../../../../generated.tsx';

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
	const [isMobile, setIsMobile] = useState(false);
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
			},
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
				console.log(
					'Failed to create conversation:',
					data.createConversation.status.errorMessage,
				);
			}
		},
		onError: (error) => {
			console.error('Error creating conversation:', error);
		},
	});

	const handleMessageSharer = async (resolvedSharerId: string) => {
		if (!currentUserId) {
			return;
		}

		try {
			await createConversation({
				variables: {
					input: {
						listingId,
						sharerId: resolvedSharerId,
						reserverId: currentUserId,
					},
				},
			});
		} catch (error) {
			console.error('Failed to create conversation:', error);
		}
	};

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth <= 600);
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	// If sharerId looks like a name (contains spaces or letters), use it directly
	// Otherwise, try to query for user data
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
				listingId={listingId}
				isOwner={isOwner}
				sharedTimeAgo={sharedTimeAgo}
				className={className}
				currentUserId={currentUserId}
				isCreating={isCreating}
				isMobile={isMobile}
				onMessageSharer={() => handleMessageSharer(sharer.id)}
			/>
		);
	}

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error loading sharer information</div>;
	if (!data?.userById) return null;

	// Both PersonalUser and AdminUser now have the same profile structure
	const firstName = data.userById.account?.profile?.firstName ?? '';
	const lastName = data.userById.account?.profile?.lastName ?? '';

	const sharer = {
		id: data.userById.id,
		name: `${firstName} ${lastName}`.trim(),
	};

	return (
		<SharerInformation
			sharer={sharer}
			listingId={listingId}
			isOwner={isOwner}
			sharedTimeAgo={sharedTimeAgo}
			className={className}
			currentUserId={currentUserId}
			isCreating={isCreating}
			isMobile={isMobile}
			onMessageSharer={() => handleMessageSharer(sharer.id)}
		/>
	);
};
