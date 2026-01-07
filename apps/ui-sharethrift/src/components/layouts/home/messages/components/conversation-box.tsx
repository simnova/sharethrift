import type { Conversation } from '../../../../../generated.tsx';
import { ListingBanner } from './listing-banner.tsx';
import { MessageThread } from './index.ts';
import { useState, useCallback, useMemo } from 'react';

interface ConversationBoxProps {
	data: Conversation;
	currentUserId?: string;
	onSendMessage: (content: string) => Promise<boolean>;
	sendingMessage: boolean;
}

export const ConversationBox: React.FC<ConversationBoxProps> = (props) => {
	const [messageText, setMessageText] = useState('');

	const currentUserId = props.currentUserId ?? props?.data?.sharer?.id;

	const handleSendMessage = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			console.log('Send message logic to be implemented', messageText);
		},
		[messageText],
	);

	// Build user info for sharer and reserver - memoized to avoid unnecessary rerenders
	const sharerInfo = useMemo(
		() => ({
			id: props.data.sharer?.id || '',
			displayName: props.data.sharer?.account?.profile?.firstName ?? 'Unknown',
		}),
		[props.data?.sharer],
	);

	const reserverInfo = useMemo(
		() => ({
			id: props.data.reserver?.id || '',
			displayName:
				props.data.reserver?.account?.profile?.firstName ?? 'Unknown',
		}),
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
