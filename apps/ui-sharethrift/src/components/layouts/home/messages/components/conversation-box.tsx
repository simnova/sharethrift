import type { Conversation } from '../../../../../generated.tsx';
import { ListingBanner } from './listing-banner.tsx';
import { MessageThread } from './index.ts';
import { useState, useCallback, useMemo } from 'react';

interface ConversationBoxProps {
	data: Conversation;
}

// Helper function to extract display name from User type
// This is a module-level pure function that can be called directly.
const getUserDisplayName = (
	user: Conversation['sharer'] | Conversation['reserver'] | undefined,
): string => {
	if (!user) return 'Unknown';
	// Handle both PersonalUser and AdminUser account structures
	const account = 'account' in user ? user.account : undefined;
	const firstName = account?.profile?.firstName;
	const lastName = account?.profile?.lastName;
	if (firstName || lastName) {
		return [firstName, lastName].filter(Boolean).join(' ');
	}
	return account?.username || 'Unknown';
};

export const ConversationBox: React.FC<ConversationBoxProps> = (props) => {
	const [messageText, setMessageText] = useState('');

	const currentUserId = props?.data?.sharer?.id;

	const handleSendMessage = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			console.log('Send message logic to be implemented', messageText);
		},
		[messageText],
	);

	// Build user info for sharer and reserver - memoized to avoid unnecessary rerenders
	const sharerInfo = useMemo(
		() =>
			props.data?.sharer
				? {
						id: props.data.sharer.id,
						displayName: getUserDisplayName(props.data.sharer),
					}
				: undefined,
		[props.data?.sharer],
	);

	const reserverInfo = useMemo(
		() =>
			props.data?.reserver
				? {
						id: props.data.reserver.id,
						displayName: getUserDisplayName(props.data.reserver),
					}
				: undefined,
		[props.data?.reserver],
	);

	return (
		<>
			<div style={{ marginBottom: 24 }}>
				<ListingBanner owner={props.data?.sharer} />
			</div>

			<div
				style={{
					flex: 1,
					minHeight: 0,
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<MessageThread
					conversationId={props.data.id}
					messages={props.data.messages || []}
					loading={false}
					error={null}
					sendingMessage={false}
					messageText={messageText}
					setMessageText={setMessageText}
					handleSendMessage={handleSendMessage}
					currentUserId={currentUserId}
					sharer={sharerInfo}
					reserver={reserverInfo}
				/>
			</div>
		</>
	);
};
