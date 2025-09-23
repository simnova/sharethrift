import {
	List,
	Avatar,
	Input,
	Button,
	Spin,
	Empty,
	message as antdMessage,
} from 'antd';
import { SendOutlined } from '@ant-design/icons';

interface Message {
	id: string;
	twilioMessageSid: string;
	conversationId: string;
	authorId: string;
	content: string;
	createdAt: string;
}

interface MessageThreadProps {
	conversationId: string;
	messages: Message[];
	loading: boolean;
	error?: unknown;
	messageText: string;
	setMessageText: (text: string) => void;
	sendingMessage: boolean;
	handleSendMessage: (e: React.FormEvent) => void;
	messagesEndRef: React.RefObject<HTMLDivElement | null>;
	currentUserId: string;
	contentContainerStyle?: React.CSSProperties;
}

export function MessageThread({
	messages,
	loading,
	error,
	messageText,
	setMessageText,
	sendingMessage,
	handleSendMessage,
	messagesEndRef,
	currentUserId,
	contentContainerStyle,
}: MessageThreadProps) {
	if (loading) {
		return (
			<Spin
				style={{
					width: '100%',
					marginTop: 32,
					fontFamily: 'var(--Urbanist, Arial, sans-serif)',
				}}
				tip="Loading messages..."
			/>
		);
	}
	if (error) {
		antdMessage.error('Error loading messages');
		return (
			<Empty
				description="Failed to load messages"
				style={{
					marginTop: 32,
					fontFamily: 'var(--Urbanist, Arial, sans-serif)',
				}}
			/>
		);
	}

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				width: '100%',
				fontFamily: 'var(--Urbanist, Arial, sans-serif)',
			}}
		>
			{/* Messages Area */}
			<div
				style={{
					flex: 1,
					width: '100%',
					overflowY: 'auto',
					background: '#f5f5f5',
				}}
			>
				<div
					style={{
						...contentContainerStyle,
						fontFamily: 'var(--Urbanist, Arial, sans-serif)',
					}}
				>
					{messages.length === 0 ? (
						<Empty
							description="No messages yet"
							style={{
								marginTop: 32,
								fontFamily: 'var(--Urbanist, Arial, sans-serif)',
							}}
						/>
					) : (
						<List
							dataSource={messages}
							renderItem={(message, index) => (
								<MessageBubble
									key={message.id}
									message={message}
									isOwn={message.authorId === currentUserId}
									showAvatar={
										index === 0 ||
										(index > 0 &&
											messages[index - 1]?.authorId !== message.authorId)
									}
								/>
							)}
						/>
					)}
					<div ref={messagesEndRef} />
				</div>
			</div>
			{/* Message Input */}
			<div
				style={{
					padding: 16,
					background: '#fff',
					borderTop: '1px solid #f0f0f0',
					fontFamily: 'var(--Urbanist, Arial, sans-serif)',
				}}
			>
				<form
					onSubmit={handleSendMessage}
					style={{
						display: 'flex',
						gap: 8,
						fontFamily: 'var(--Urbanist, Arial, sans-serif)',
					}}
				>
					<Input
						value={messageText}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setMessageText(e.target.value)
						}
						placeholder="Type a message..."
						disabled={sendingMessage}
						onPressEnter={handleSendMessage}
						style={{
							flex: 1,
							fontFamily: 'var(--Urbanist, Arial, sans-serif)',
						}}
						autoComplete="off"
					/>
					<Button
						type="primary"
						htmlType="submit"
						icon={<SendOutlined />}
						loading={sendingMessage}
						disabled={!messageText.trim()}
						style={{ fontFamily: 'var(--Urbanist, Arial, sans-serif)' }}
					>
						Send
					</Button>
				</form>
			</div>
		</div>
	);
}

interface MessageBubbleProps {
	message: Message;
	isOwn: boolean;
	showAvatar: boolean;
}

function MessageBubble({ message, isOwn, showAvatar }: MessageBubbleProps) {
	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
		});
	};
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: isOwn ? 'flex-end' : 'flex-start',
				marginBottom: 8,
				fontFamily: 'var(--Urbanist, Arial, sans-serif)',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: isOwn ? 'row-reverse' : 'row',
					gap: 8,
					maxWidth: 400,
					fontFamily: 'var(--Urbanist, Arial, sans-serif)',
				}}
			>
				{showAvatar && !isOwn && (
					<Avatar
						style={{
							backgroundColor: 'var(--color-foreground-2)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							flexShrink: 0,
							fontFamily: 'var(--Urbanist, Arial, sans-serif)',
						}}
						size={32}
						icon={
							<svg
								width="18"
								height="18"
								viewBox="0 0 29 28"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								style={{ display: 'block', margin: 'auto' }}
							>
								<title>Sharethrift Logo</title>
								<path
									d="M13.5528 28C12.6493 28 11.7389 27.8973 10.8217 27.692C9.9045 27.4866 8.96675 27.1923 8.00848 26.809C8.33703 23.4961 9.29531 20.4022 10.8833 17.5274C12.4713 14.6525 14.5111 12.1199 17.0026 9.9296C13.9909 11.4628 11.383 13.4889 9.17894 16.0078C6.9749 18.5267 5.43481 21.4016 4.55867 24.6323C4.44915 24.5502 4.34648 24.4612 4.25065 24.3654L3.94263 24.0574C2.6558 22.7705 1.67699 21.3331 1.00619 19.7451C0.335398 18.1571 0 16.5007 0 14.7758C0 12.914 0.369622 11.1343 1.10887 9.43677C1.84811 7.73924 2.87484 6.23338 4.18905 4.91917C6.10561 3.00261 8.48077 1.66102 11.3145 0.894394C14.1483 0.127771 17.9746 -0.146023 22.7934 0.0730117C23.5052 0.100391 24.1623 0.257823 24.7647 0.545306C25.367 0.83279 25.9009 1.20926 26.3664 1.67471C26.8318 2.14016 27.2014 2.6809 27.4752 3.29694C27.749 3.91297 27.9133 4.57692 27.9681 5.28879C28.1323 10.2171 27.8449 14.0639 27.1056 16.8292C26.3664 19.5945 25.0522 21.9218 23.163 23.811C21.8214 25.1525 20.3224 26.1861 18.6659 26.9117C17.0095 27.6372 15.3051 28 13.5528 28Z"
									fill="var(--color-foreground-1)"
								/>
							</svg>
						}
					>
						{message.authorId.charAt(0).toUpperCase()}
					</Avatar>
				)}
				{showAvatar && isOwn && <div style={{ width: 32 }} />}
				{!showAvatar && <div style={{ width: 32 }} />}
				<div
					style={{
						background: isOwn ? 'var(--color-primary)' : '#fff',
						color: isOwn
							? 'var(--color-highlight)'
							: 'var(--color-message-text)',
						borderRadius: 16,
						padding: '8px 16px',
						border: isOwn ? 'none' : '1px solid var(--color-foreground-2)',
						minWidth: 60,
						maxWidth: 320,
						wordBreak: 'break-word',
						fontFamily: 'var(--Urbanist, Arial, sans-serif)',
					}}
				>
					<p
						style={{
							margin: 0,
							color: isOwn
								? 'var(--color-highlight)'
								: 'var(--color-message-text)',
							fontFamily: 'var(--Urbanist, Arial, sans-serif)',
						}}
					>
						{message.content}
					</p>
					<div
						style={{
							fontSize: 10,
							color: isOwn
								? 'var(--color-highlight)'
								: 'var(--color-foreground-1)',
							marginTop: 4,
							textAlign: isOwn ? 'right' : 'left',
							fontFamily: 'var(--Urbanist, Arial, sans-serif)',
						}}
					>
						{formatTime(message.createdAt)}
					</div>
				</div>
			</div>
		</div>
	);
}
