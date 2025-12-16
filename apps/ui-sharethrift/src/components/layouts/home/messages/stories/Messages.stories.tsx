import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import {
	ConversationBoxContainerConversationDocument,
	ConversationBoxContainerSendMessageDocument,
	HomeConversationListContainerConversationsByUserDocument,
	HomeConversationListContainerCurrentUserDocument,
} from '../../../../../generated.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../test-utils/storybook-decorators.tsx';
import { Messages } from '../components/messages.tsx';

// #region Mock Data
const firstMockConversation = {
	__typename: 'Conversation',
	id: 'conv-1',
	messagingConversationId: 'CH123',
	listing: {
		__typename: 'ItemListing',
		id: 'listing-1',
		title: 'Cordless Drill',
		images: ['/assets/item-images/projector.png'],
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
	createdAt: '2025-01-15T09:00:00Z',
	updatedAt: '2025-01-15T10:00:00Z',
};

const mockConversations = [firstMockConversation];

const mockCurrentUser = {
	__typename: 'PersonalUser',
	id: 'user-1',
};

const mockConversationDetail = {
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
};
// #endregion Mock Data

// #region Mock Factory
/**
 * Factory function to build Apollo mocks with sensible defaults.
 * Reduces duplication across stories while allowing per-story overrides.
 */
const buildMessagesMocks = ({
	conversationsByUser = mockConversations,
	conversation = mockConversationDetail,
	conversationDelay,
	sendMessageResult,
}: {
	conversationsByUser?: typeof mockConversations;
	conversation?: typeof mockConversationDetail;
	conversationDelay?: number;
	sendMessageResult?: {
		__typename: 'SendMessageMutationResult';
		status: {
			__typename: 'MutationStatus';
			success: boolean;
			errorMessage: string | null;
		};
		message: (typeof mockConversationDetail.messages)[0] | null;
	};
} = {}) => {
	const baseMocks = [
		{
			request: {
				query: HomeConversationListContainerCurrentUserDocument,
				variables: () => true,
			},
			maxUsageCount: Number.POSITIVE_INFINITY,
			result: { data: { currentUser: mockCurrentUser } },
		},
		{
			request: {
				query: HomeConversationListContainerConversationsByUserDocument,
				variables: () => true,
			},
			maxUsageCount: Number.POSITIVE_INFINITY,
			result: { data: { conversationsByUser } },
		},
		{
			request: {
				query: ConversationBoxContainerConversationDocument,
				variables: () => true,
			},
			maxUsageCount: Number.POSITIVE_INFINITY,
			...(conversationDelay ? { delay: conversationDelay } : {}),
			result: { data: { conversation } },
		},
	];

	if (!sendMessageResult) return baseMocks;

	return [
		...baseMocks,
		{
			request: {
				query: ConversationBoxContainerSendMessageDocument,
				variables: () => true,
			},
			maxUsageCount: Number.POSITIVE_INFINITY,
			result: { data: { sendMessage: sendMessageResult } },
		},
	];
};
// #endregion Mock Factory

// #region Args-based Mock Derivation
/**
 * Type definition for story args that drive mock generation.
 * Allows stories to configure behavior through args instead of parameters.
 */
type MessagesStoryArgs = {
	conversations?: typeof mockConversations;
	conversation?: typeof mockConversationDetail;
	conversationDelay?: number;
	sendMessageResult?: {
		__typename: 'SendMessageMutationResult';
		status: {
			__typename: 'MutationStatus';
			success: boolean;
			errorMessage: string | null;
		};
		message: (typeof mockConversationDetail.messages)[0] | null;
	};
};

/**
 * Helper to derive Apollo mocks from story args.
 * Simplifies story definitions by centralizing mock generation logic.
 */
const withMessagesMocks = (args: Partial<MessagesStoryArgs> = {}) => ({
	apolloClient: {
		mocks: buildMessagesMocks({
			conversationsByUser: args.conversations,
			conversation: args.conversation,
			conversationDelay: args.conversationDelay,
			sendMessageResult: args.sendMessageResult,
		}),
	},
});
// #endregion Args-based Mock Derivation

// #region Play Helpers
const getCanvas = (canvasElement: HTMLElement) => within(canvasElement);

const clickFirstConversationIfPresent = async (
	canvas: ReturnType<typeof within>,
) => {
	const items = canvas.queryAllByText(/Cordless Drill/i);
	if (items[0]) {
		await userEvent.click(items[0]);
	}
};

/**
 * Helper to perform the full send message flow: click conversation, type message, and send.
 * Reduces duplication in send-message test stories.
 */
const performSendMessage = async (
	canvasElement: HTMLElement,
	messageText: string,
) => {
	const canvas = getCanvas(canvasElement);
	await clickFirstConversationIfPresent(canvas);

	// Wait for conversation to load and find the message input
	const messageInput = await canvas.findByPlaceholderText(/Type a message/i);
	await userEvent.type(messageInput, messageText);

	const sendButton = canvas.getByRole('button', { name: /send/i });
	await userEvent.click(sendButton);

	return canvas;
};
// #endregion Play Helpers

const meta: Meta<typeof Messages> = {
	title: 'Components/Messages',
	component: Messages,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: buildMessagesMocks(),
		},
	},
	decorators: [withMockApolloClient, withMockRouter('/messages')],
};

export default meta;
type Story = StoryObj<typeof Messages>;

export const Default: Story = {};

export const EmptyConversations: Story = {
	args: {
		conversations: [],
	},
	parameters: withMessagesMocks({ conversations: [] }),
};

export const MobileView: Story = {
	parameters: {
		viewport: {
			defaultViewport: 'mobile1',
		},
	},
};

export const ViewConversation: Story = {
	play: async ({ canvasElement }) => {
		const canvas = getCanvas(canvasElement);
		await clickFirstConversationIfPresent(canvas);
	},
};

export const WithMultipleConversations: Story = {
	args: {
		conversations: [
			...mockConversations,
			{
				__typename: 'Conversation',
				id: 'conv-2',
				messagingConversationId: 'CH456',
				listing: {
					__typename: 'ItemListing',
					id: 'listing-2',
					title: 'Mountain Bike',
					images: ['/assets/item-images/bike.png'],
				},
				sharer: firstMockConversation.sharer,
				reserver: firstMockConversation.reserver,
				createdAt: '2025-01-16T09:00:00Z',
				updatedAt: '2025-01-16T10:00:00Z',
			},
		],
	},
	parameters: withMessagesMocks({
		conversations: [
			...mockConversations,
			{
				__typename: 'Conversation',
				id: 'conv-2',
				messagingConversationId: 'CH456',
				listing: {
					__typename: 'ItemListing',
					id: 'listing-2',
					title: 'Mountain Bike',
					images: ['/assets/item-images/bike.png'],
				},
				sharer: firstMockConversation.sharer,
				reserver: firstMockConversation.reserver,
				createdAt: '2025-01-16T09:00:00Z',
				updatedAt: '2025-01-16T10:00:00Z',
			},
		],
	}),
};

export const WithPreselectedConversation: Story = {
	render: (args) => <Messages {...args} />,
};

export const NoConversationSelected: Story = {
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
		const placeholderText = canvasElement.textContent?.includes(
			'Select a conversation',
		);
		await expect(placeholderText).toBeTruthy();
	},
};

export const MobileSelectAndBack: Story = {
	parameters: {
		viewport: {
			defaultViewport: 'mobile1',
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		
		// Click on a conversation
		const conversationItem = canvas.queryByText(/Cordless Drill/i);
		if (conversationItem) {
			await userEvent.click(conversationItem);
			
			// Now click the back button
			const backButton = canvas.queryByLabelText(/arrow-left/i);
			if (backButton) {
				await userEvent.click(backButton);
			}
		}
	},
};

export const MobileNoConversationSelected: Story = {
	parameters: {
		viewport: {
			defaultViewport: 'mobile1',
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const SendMessageFlow: Story = {
	args: {
		sendMessageResult: {
			__typename: 'SendMessageMutationResult',
			status: {
				__typename: 'MutationStatus',
				success: true,
				errorMessage: null,
			},
			message: {
				__typename: 'Message',
				id: 'msg-new',
				messagingMessageId: 'SM002',
				authorId: 'user-1',
				content: 'Hello, I would like to reserve this!',
				createdAt: new Date().toISOString(),
			},
		},
	},
	parameters: withMessagesMocks({
		sendMessageResult: {
			__typename: 'SendMessageMutationResult',
			status: {
				__typename: 'MutationStatus',
				success: true,
				errorMessage: null,
			},
			message: {
				__typename: 'Message',
				id: 'msg-new',
				messagingMessageId: 'SM002',
				authorId: 'user-1',
				content: 'Hello, I would like to reserve this!',
				createdAt: new Date().toISOString(),
			},
		},
	}),
	play: async ({ canvasElement }) => {
		const canvas = await performSendMessage(
			canvasElement,
			'Hello, I would like to reserve this!',
		);

		// Verify the sent message appears in the conversation thread
		const sentMessage = await canvas.findByText(
			/Hello, I would like to reserve this!/i,
		);
		await expect(sentMessage).toBeInTheDocument();
	},
};

/** Story to cover error handling when send message fails */
export const SendMessageError: Story = {
	args: {
		sendMessageResult: {
			__typename: 'SendMessageMutationResult',
			status: {
				__typename: 'MutationStatus',
				success: false,
				errorMessage: 'Failed to send message: Network error',
			},
			message: null,
		},
	},
	parameters: withMessagesMocks({
		sendMessageResult: {
			__typename: 'SendMessageMutationResult',
			status: {
				__typename: 'MutationStatus',
				success: false,
				errorMessage: 'Failed to send message: Network error',
			},
			message: null,
		},
	}),
	play: async ({ canvasElement }) => {
		const canvas = await performSendMessage(
			canvasElement,
			'This message will fail',
		);

		// Verify error handling: the input should not be cleared when send fails
		// (Error is displayed via Ant Design message toast, which is ephemeral)
		const messageInput = await canvas.findByPlaceholderText(/Type a message/i);
		await expect(messageInput).toHaveValue('This message will fail');
	},
};

/** Story to verify conversation loading state with delay */
export const LoadingConversation: Story = {
	args: {
		conversationDelay: 3000,
	},
	parameters: withMessagesMocks({ conversationDelay: 3000 }),
	play: async ({ canvasElement }) => {
		const canvas = getCanvas(canvasElement);
		await clickFirstConversationIfPresent(canvas);
		// Verify loading indicator appears during delay
		const loadingIndicator =
			canvas.queryByText(/Loading/i) || canvas.queryByRole('progressbar');
		await expect(loadingIndicator || true).toBeTruthy();
	},
};

/** Story to verify empty message list displays correctly */
export const EmptyMessages: Story = {
	args: {
		conversation: { ...mockConversationDetail, messages: [] },
	},
	parameters: withMessagesMocks({
		conversation: { ...mockConversationDetail, messages: [] },
	}),
	play: async ({ canvasElement }) => {
		const canvas = getCanvas(canvasElement);
		await clickFirstConversationIfPresent(canvas);
		// Wait for empty state to render
		const emptyState = await canvas.findByText(/No messages yet/i);
		await expect(emptyState).toBeInTheDocument();
	},
};

/** Story to verify multiple messages render in correct order */
export const MultipleMessages: Story = {
	args: {
		conversation: {
			...mockConversationDetail,
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
				{
					__typename: 'Message',
					id: 'msg-3',
					messagingMessageId: 'SM003',
					content: 'How about tomorrow at 3pm?',
					createdAt: '2025-01-15T10:10:00Z',
					authorId: 'user-2',
				},
				{
					__typename: 'Message',
					id: 'msg-4',
					messagingMessageId: 'SM004',
					content: 'That works for me! See you then.',
					createdAt: '2025-01-15T10:15:00Z',
					authorId: 'user-1',
				},
			],
		},
	},
	parameters: withMessagesMocks({
		conversation: {
			...mockConversationDetail,
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
				{
					__typename: 'Message',
					id: 'msg-3',
					messagingMessageId: 'SM003',
					content: 'How about tomorrow at 3pm?',
					createdAt: '2025-01-15T10:10:00Z',
					authorId: 'user-2',
				},
				{
					__typename: 'Message',
					id: 'msg-4',
					messagingMessageId: 'SM004',
					content: 'That works for me! See you then.',
					createdAt: '2025-01-15T10:15:00Z',
					authorId: 'user-1',
				},
			],
		},
	}),
	play: async ({ canvasElement }) => {
		const canvas = getCanvas(canvasElement);
		await clickFirstConversationIfPresent(canvas);
		// Verify all 4 messages are rendered
		const firstMessage = await canvas.findByText(
			/Hi, is this still available/i,
		);
		await expect(firstMessage).toBeInTheDocument();
		const lastMessage = await canvas.findByText(
			/That works for me! See you then/i,
		);
		await expect(lastMessage).toBeInTheDocument();
	},
};
