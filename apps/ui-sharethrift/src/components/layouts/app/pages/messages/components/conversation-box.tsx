import { useState } from 'react';
import type { Conversation } from '../../../../../../generated.tsx';
import { MessageThread } from './index.ts';
import { ListingBanner } from './listing-banner.tsx';

interface ConversationBoxProps {
	data: Conversation;
	currentUserId?: string;
	onSendMessage: (content: string) => Promise<boolean>;
	sendingMessage: boolean;
}

export const ConversationBox: React.FC<ConversationBoxProps> = (props) => {
	const [messageText, setMessageText] = useState('');

	const currentUserId = props.currentUserId ?? props?.data?.sharer?.id;

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (props.sendingMessage) return; // Prevent duplicate submits while send is in flight
		if (!messageText.trim()) return;

		// Only clear input on successful send so users don't lose unsent content on error
		const success = await props.onSendMessage(messageText);
		if (success) {
			setMessageText('');
		}
	};

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
					sendingMessage={props.sendingMessage}
					messageText={messageText}
					setMessageText={setMessageText}
					handleSendMessage={handleSendMessage}
					currentUserId={currentUserId}
				/>
			</div>
		</>
	);
};
