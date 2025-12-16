import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { MessageThread } from '../components/message-thread.tsx';

const mockMessages = [
	{
		id: 'm1',
		messagingMessageId: 'SM1',
		conversationId: '1',
		authorId: 'user123',
		content: 'Hey Alice, is the bike still available?',
		createdAt: '2025-08-08T12:01:00Z',
	},
	{
		id: 'm2',
		messagingMessageId: 'SM2',
		conversationId: '1',
		authorId: 'Alice',
		content: 'Yes, it is! Do you want to see it?',
		createdAt: '2025-08-08T12:02:00Z',
	},
];

const meta: Meta<typeof MessageThread> = {
	title: 'Components/Messages/MessageThread',
	component: MessageThread,
	argTypes: {
		setMessageText: { action: 'message text set' },
		handleSendMessage: { action: 'message sent' },
	},
};
export default meta;
type Story = StoryObj<typeof MessageThread>;

export const Default: Story = {
	args: {
		conversationId: '1',
		messages: mockMessages,
		loading: false,
		error: null,
		messageText: '',
		setMessageText: () => {
			console.log('Set message text');
		},
		sendingMessage: false,
		handleSendMessage: () => {
			console.log('handle send message');
		},
		currentUserId: 'user123',
		contentContainerStyle: { paddingLeft: 24 },
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText(/Hey Alice/i)).toBeInTheDocument();
	},
};
