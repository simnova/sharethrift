import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { Conversation } from '../../../../../generated.tsx';
import { ConversationBox } from '../components/conversation-box.tsx';

const mockConversation = {
	__typename: 'Conversation',
	id: 'conv-1',
	messagingConversationId: 'CH123',
	schemaVersion: '1',
	listing: {
		__typename: 'ItemListing',
		id: 'listing-1',
		title: 'Cordless Drill',
		description: 'High-quality drill',
		category: 'Tools',
		location: 'Toronto',
		images: ['/assets/item-images/projector.png'],
		listingType: 'Item',
		sharingPeriodStart: '2025-01-15',
		sharingPeriodEnd: '2025-12-31',
	},
	sharer: {
		__typename: 'PersonalUser',
		id: 'user-1',
		account: {
			__typename: 'PersonalUserAccount',
			username: 'john_doe',
			profile: {
				__typename: 'PersonalUserAccountProfile',
				firstName: 'John',
				lastName: 'Doe',
			},
		},
	},
	reserver: {
		__typename: 'PersonalUser',
		id: 'user-2',
		account: {
			__typename: 'PersonalUserAccount',
			username: 'jane_smith',
			profile: {
				__typename: 'PersonalUserAccountProfile',
				firstName: 'Jane',
				lastName: 'Smith',
			},
		},
	},
	messages: [
		{
			__typename: 'Message',
			id: 'msg-1',
			messagingMessageId: 'SM001',
			content: 'Hi, is this still available?',
			createdAt: '2025-01-15T10:00:00Z',
			authorId: 'user-2',
		},
	],
	createdAt: '2025-01-15T09:00:00Z',
	updatedAt: '2025-01-15T10:00:00Z',
} as Conversation;

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
		// ListingBanner shows "{firstName}'s Listing"
		await expect(canvas.getByText(/John's Listing/i)).toBeInTheDocument();
	},
};

export const WithMultipleMessages: Story = {
	args: {
		data: {
			...mockConversation,
			messages: [
				{
					__typename: 'Message',
					id: 'msg-1',
					messagingMessageId: 'SM001',
					content: 'Hi, is this still available?',
					createdAt: '2025-01-15T10:00:00Z',
					authorId: 'user-2',
				},
				{
					__typename: 'Message',
					id: 'msg-2',
					messagingMessageId: 'SM002',
					content: 'Yes it is! When would you like to pick it up?',
					createdAt: '2025-01-15T10:05:00Z',
					authorId: 'user-1',
				},
			],
		} as Conversation,
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
		} as Conversation,
		currentUserId: 'user-1',
		onSendMessage: fn(),
		sendingMessage: false,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Placeholder text is "Type a message..."
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
		// Placeholder text is "Type a message..."
		const textArea = canvas.getByPlaceholderText(/Type a message/i);

		await userEvent.type(textArea, 'Hello from test');
		await expect(textArea).toHaveValue('Hello from test');

		const sendButton = canvas.getByRole('button', { name: /send/i });
		await userEvent.click(sendButton);
	},
};
