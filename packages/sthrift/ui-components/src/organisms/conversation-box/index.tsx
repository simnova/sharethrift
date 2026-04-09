import { useState } from 'react';
import { MessageThread } from '../message-thread/index.tsx';
import { ListingBanner } from '../listing-banner/index.tsx';

interface ConversationMessage {
	id: string;
	messagingMessageId: string;
	authorId: string;
	content: string;
	createdAt: string;
}

interface ConversationBoxData {
	id: string;
	sharer: {
		id?: string;
		account?: {
			profile?: {
				firstName?: string | null;
			} | null;
		} | null;
	} | null;
	messages?: ConversationMessage[] | null;
}

interface ConversationBoxProps {
	data: ConversationBoxData;
	currentUserId?: string;
	onSendMessage: (content: string) => Promise<boolean>;
	sendingMessage: boolean;
}

export type { ConversationBoxData };

export const ConversationBox: React.FC<ConversationBoxProps> = (props) => {
	const [messageText, setMessageText] = useState('');

	const currentUserId = props.currentUserId ?? props?.data?.sharer?.id ?? '';

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (props.sendingMessage) return;
		if (!messageText.trim()) return;

		const success = await props.onSendMessage(messageText);
		if (success) {
			setMessageText('');
		}
	};

	return (
		<>
			<div style={{ marginBottom: 24 }}>
				<ListingBanner owner={props.data?.sharer ?? {}} />
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
