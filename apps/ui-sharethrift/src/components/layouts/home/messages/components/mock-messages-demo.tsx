import { useState, useRef, useEffect } from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { ConversationList } from './conversation-list.tsx';
import { MessageThread } from './message-thread.tsx';
import { ListingBannerContainer } from './listing-banner.container.tsx';

// Types
interface Conversation {
	id: string;
	twilioConversationSid: string;
	listingId: string;
	participants: string[];
	createdAt: string;
	updatedAt: string;
}

interface Message {
	id: string;
	twilioMessageSid: string;
	conversationId: string;
	authorId: string;
	content: string;
	createdAt: string;
}

// Mock data for conversations
const mockConversations: Conversation[] = [
	{
		id: '1',
		twilioConversationSid: 'CH123',
		listingId: 'Bike-001',
		participants: ['user123', 'Alice'],
		createdAt: '2025-08-08T10:00:00Z',
		updatedAt: '2025-08-08T12:00:00Z',
	},
	{
		id: '2',
		twilioConversationSid: 'CH124',
		listingId: 'Camera-002',
		participants: ['user123', 'Bob'],
		createdAt: '2025-08-07T09:00:00Z',
		updatedAt: '2025-08-08T11:30:00Z',
	},
	{
		id: '3',
		twilioConversationSid: 'CH125',
		listingId: 'Tent-003',
		participants: ['user123', 'Carol'],
		createdAt: '2025-08-06T08:00:00Z',
		updatedAt: '2025-08-08T10:45:00Z',
	},
];

// Mock messages per conversation
const initialMessages: Record<string, Message[]> = {
	'1': [
		{
			id: 'm1',
			twilioMessageSid: 'SM1',
			conversationId: '1',
			authorId: 'user123',
			content: 'Hey Alice, is the bike still available?',
			createdAt: '2025-08-08T12:01:00Z',
		},
		{
			id: 'm2',
			twilioMessageSid: 'SM2',
			conversationId: '1',
			authorId: 'Alice',
			content: 'Yes, it is! Do you want to see it?',
			createdAt: '2025-08-08T12:02:00Z',
		},
	],
	'2': [
		{
			id: 'm3',
			twilioMessageSid: 'SM3',
			conversationId: '2',
			authorId: 'user123',
			content: 'Hi Bob, is the camera in good condition?',
			createdAt: '2025-08-08T11:31:00Z',
		},
		{
			id: 'm4',
			twilioMessageSid: 'SM4',
			conversationId: '2',
			authorId: 'Bob',
			content: 'Absolutely, barely used.',
			createdAt: '2025-08-08T11:32:00Z',
		},
	],
	'3': [
		{
			id: 'm5',
			twilioMessageSid: 'SM5',
			conversationId: '3',
			authorId: 'Carol',
			content: 'Tent is available for this weekend.',
			createdAt: '2025-08-08T10:46:00Z',
		},
	],
};

export function MockMessagesDemo() {
	const [selectedConversationId, setSelectedConversationId] = useState<
		string | null
	>(mockConversations[0]?.id || null);
	const [messagesMap, setMessagesMap] =
		useState<Record<string, Message[]>>(initialMessages);
	const [messageText, setMessageText] = useState('');
	const [sendingMessage, setSendingMessage] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [showListOnMobile, setShowListOnMobile] = useState(true);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const currentUserId = 'user123';

	// Detect mobile screen
	useEffect(() => {
		const mq = window.matchMedia('(max-width: 576px)');
		const handleResize = () => setIsMobile(mq.matches);
		handleResize();
		mq.addEventListener('change', handleResize);
		return () => mq.removeEventListener('change', handleResize);
	}, []);

	// When switching to desktop, always show both
	useEffect(() => {
		if (!isMobile) setShowListOnMobile(true);
	}, [isMobile]);

	// Scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
		// Only depend on messages for the selected conversation
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messagesMap[selectedConversationId ?? '']]);

	const handleConversationSelect = (id: string) => {
		setSelectedConversationId(id);
		setMessageText('');
		if (isMobile) setShowListOnMobile(false);
	};

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!messageText.trim() || !selectedConversationId) return;
		setSendingMessage(true);
		setTimeout(() => {
			setMessagesMap((prev) => {
				const newMsg: Message = {
					id: `m${Date.now()}`,
					twilioMessageSid: `SM${Date.now()}`,
					conversationId: selectedConversationId,
					authorId: currentUserId,
					content: messageText.trim(),
					createdAt: new Date().toISOString(),
				};
				return {
					...prev,
					[selectedConversationId]: [
						...(prev[selectedConversationId] || []),
						newMsg,
					],
				};
			});
			setMessageText('');
			setSendingMessage(false);
		}, 300); // Simulate network delay
	};

	// Responsive layout
	if (isMobile) {
		return (
			<div
				style={{
					height: '100%',
					width: '100%',
					minHeight: 0,
					minWidth: 0,
					overflow: 'hidden',
					background: 'var(--color-background)',
				}}
			>
				{showListOnMobile ? (
					<div style={{ width: '100%', height: '100%' }}>
						<ConversationList
							onConversationSelect={handleConversationSelect}
							selectedConversationId={selectedConversationId}
							conversations={mockConversations}
						/>
					</div>
				) : (
					<div
						style={{
							width: '100%',
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							background: '#f5f5f5',
						}}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								height: 48,
								background: 'var(--color-background-2)',
								borderBottom: '1px solid var(--color-foreground-2)',
							}}
						>
							<Button
								type="text"
								icon={<ArrowLeftOutlined />}
								onClick={() => setShowListOnMobile(true)}
								style={{ marginLeft: 8, fontSize: 20 }}
							/>
							<span
								style={{
									fontWeight: 600,
									fontFamily: 'var(--Urbanist)',
									fontSize: 16,
									marginLeft: 8,
								}}
							>
								Conversation
							</span>
						</div>
						{/* Banner at the top */}
						{(() => {
							const conv = mockConversations.find(
								(c) => c.id === selectedConversationId,
							);
							const owner =
								conv?.participants.find((p) => p !== currentUserId) ||
								'Unknown';
							return conv ? (
								<div style={{ marginBottom: 16 }}>
									<ListingBannerContainer
										listingId={conv.listingId}
										owner={owner}
									/>
								</div>
							) : null;
						})()}
						<div
							style={{
								flex: 1,
								minHeight: 0,
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<MessageThread
								conversationId={selectedConversationId ?? ''}
								messages={messagesMap[selectedConversationId ?? ''] || []}
								loading={false}
								error={null}
								messageText={messageText}
								setMessageText={setMessageText}
								sendingMessage={sendingMessage}
								handleSendMessage={handleSendMessage}
								messagesEndRef={messagesEndRef}
								currentUserId={currentUserId}
								contentContainerStyle={{ paddingLeft: 8, paddingRight: 8 }}
							/>
						</div>
					</div>
				)}
			</div>
		);
	}

	// Desktop layout (unchanged)
	return (
		<div
			style={{
				display: 'flex',
				height: '100%',
				width: '100%',
				minHeight: 0,
				minWidth: 0,
				overflow: 'hidden',
			}}
		>
			{/* Conversation List */}
			<div
				style={{
					width: 'clamp(220px, 28vw, 340px)',
					minWidth: 180,
					maxWidth: 400,
					borderRight: '1px solid var(--color-foreground-2)',
				}}
			>
				<ConversationList
					onConversationSelect={handleConversationSelect}
					selectedConversationId={selectedConversationId}
					conversations={mockConversations}
				/>
			</div>
			{/* Message Thread with Listing Banner */}
			<div
				style={{
					flex: 1,
					background: '#f5f5f5',
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
				}}
			>
				{selectedConversationId ? (
					<>
						{/* Banner at the top */}
						{(() => {
							const conv = mockConversations.find(
								(c) => c.id === selectedConversationId,
							);
							const owner =
								conv?.participants.find((p) => p !== currentUserId) ||
								'Unknown';
							return conv ? (
								<div style={{ marginBottom: 24 }}>
									<ListingBannerContainer
										listingId={conv.listingId}
										owner={owner}
									/>
								</div>
							) : null;
						})()}
						<div
							style={{
								flex: 1,
								minHeight: 0,
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<MessageThread
								conversationId={selectedConversationId}
								messages={messagesMap[selectedConversationId] || []}
								loading={false}
								error={null}
								messageText={messageText}
								setMessageText={setMessageText}
								sendingMessage={sendingMessage}
								handleSendMessage={handleSendMessage}
								messagesEndRef={messagesEndRef}
								currentUserId={currentUserId}
								contentContainerStyle={{ paddingLeft: 24 }}
							/>
						</div>
					</>
				) : (
					<div style={{ padding: 32, textAlign: 'center', color: '#888' }}>
						Select a conversation to start messaging.
					</div>
				)}
			</div>
		</div>
	);
}
