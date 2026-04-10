import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ConversationBox, type ConversationBoxData } from './conversation-box.tsx';

const mockConversation: ConversationBoxData = {
	id: 'conv-1',
	sharer: {
		id: 'user-1',
		account: {
			profile: {
				firstName: 'John',
			},
		},
	},
	messages: [
		{
			id: 'msg-1',
			messagingMessageId: 'SM001',
			content: 'Hi, is this still available?',
			createdAt: '2025-01-15T10:00:00Z',
			authorId: 'user-2',
		},
	],
};

const meta: Meta<typeof ConversationBox> = {
	title: 'Components/Messages/ConversationBox',
	component: ConversationBox,
	argTypes: {
		onSendMessage: { action: 'message sent' },
	},
};
export default meta;
type Story = StoryObj<typeof ConversationBox>;

export const Default: Story = {
	args: {
		data: mockConversation,
		currentUserId: 'user-1',
		onSendMessage: fn(),
		sendingMessage: false,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText(/John's Listing/i)).toBeInTheDocument();
	},
};

export const WithMultipleMessages: Story = {
	args: {
		data: {
			...mockConversation,
			messages: [
				{
					id: 'msg-1',
					messagingMessageId: 'SM001',
					content: 'Hi, is this still available?',
					createdAt: '2025-01-15T10:00:00Z',
					authorId: 'user-2',
				},
				{
					id: 'msg-2',
					messagingMessageId: 'SM002',
					content: 'Yes it is! When would you like to pick it up?',
					createdAt: '2025-01-15T10:05:00Z',
					authorId: 'user-1',
				},
			],
		},
		currentUserId: 'user-1',
		onSendMessage: fn(),
		sendingMessage: false,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(
			canvas.getByText(/Hi, is this still available?/i),
		).toBeInTheDocument();
		await expect(canvas.getByText(/Yes it is!/i)).toBeInTheDocument();
	},
};

export const EmptyConversation: Story = {
	args: {
		data: {
			...mockConversation,
			messages: [],
		},
		currentUserId: 'user-1',
		onSendMessage: fn(),
		sendingMessage: false,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(
			canvas.getByPlaceholderText(/Type a message/i),
		).toBeInTheDocument();
	},
};

export const SendingMessage: Story = {
	args: {
		data: mockConversation,
		currentUserId: 'user-1',
		onSendMessage: fn(),
		sendingMessage: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const sendButton = canvas.getByRole('button', { name: /send/i });
		await expect(sendButton).toBeDisabled();
	},
};

export const TypeAndSendMessage: Story = {
	args: {
		data: mockConversation,
		currentUserId: 'user-1',
		onSendMessage: fn(),
		sendingMessage: false,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const textArea = canvas.getByPlaceholderText(/Type a message/i);

		await userEvent.type(textArea, 'Hello from test');
		await expect(textArea).toHaveValue('Hello from test');

		const sendButton = canvas.getByRole('button', { name: /send/i });
		await userEvent.click(sendButton);
	},
};
