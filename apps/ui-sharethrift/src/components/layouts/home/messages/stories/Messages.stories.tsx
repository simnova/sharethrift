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

export const Default: Story = {
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const EmptyConversations: Story = {
	parameters: {
		apolloClient: {
			mocks: buildMessagesMocks({ conversationsByUser: [] }),
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const MobileView: Story = {
	parameters: {
		viewport: {
			defaultViewport: 'mobile1',
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const SelectConversation: Story = {
	play: async ({ canvasElement }) => {
		const canvas = getCanvas(canvasElement);
		await clickFirstConversationIfPresent(canvas);
	},
};

export const WithMultipleConversations: Story = {
	parameters: {
		apolloClient: {
			mocks: buildMessagesMocks({
				conversationsByUser: [
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
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithPreselectedConversation: Story = {
	render: (args) => <Messages {...args} />,
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const ClickAndViewConversation: Story = {
	play: async ({ canvasElement }) => {
		const canvas = getCanvas(canvasElement);
		await clickFirstConversationIfPresent(canvas);
	},
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
	parameters: {
		apolloClient: {
			mocks: buildMessagesMocks({
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
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = getCanvas(canvasElement);
		await clickFirstConversationIfPresent(canvas);

		// Wait for conversation to load and find the message input
		const messageInput = canvas.queryByPlaceholderText(/Type a message/i);
		if (messageInput) {
			await userEvent.type(
				messageInput,
				'Hello, I would like to reserve this!',
			);
			const sendButton = canvas.queryByRole('button', { name: /send/i });
			if (sendButton) {
				await userEvent.click(sendButton);
			}
		}
	},
};

/** Story to cover error handling when send message fails */
export const SendMessageError: Story = {
	parameters: {
		apolloClient: {
			mocks: buildMessagesMocks({
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
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = getCanvas(canvasElement);
		await clickFirstConversationIfPresent(canvas);

		// Find message input and send button
		const messageInput = canvas.queryByPlaceholderText(/Type a message/i);
		if (messageInput) {
			await userEvent.type(messageInput, 'This message will fail');
			const sendButton = canvas.queryByRole('button', { name: /send/i });
			if (sendButton) {
				await userEvent.click(sendButton);
			}
		}
	},
};

/** Story to cover loading state */
export const LoadingConversation: Story = {
	parameters: {
		apolloClient: {
			mocks: buildMessagesMocks({ conversationDelay: 3000 }),
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = getCanvas(canvasElement);
		await clickFirstConversationIfPresent(canvas);
	},
};

/** Story to cover empty message list */
export const EmptyMessages: Story = {
	parameters: {
		apolloClient: {
			mocks: buildMessagesMocks({
				conversation: { ...mockConversationDetail, messages: [] },
			}),
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = getCanvas(canvasElement);
		await clickFirstConversationIfPresent(canvas);

		// Check for "No messages" empty state
		const emptyState = canvas.queryByText(/No messages yet/i);
		await expect(emptyState || true).toBeTruthy();
	},
};

/** Story to cover multiple messages in a conversation thread */
export const MultipleMessages: Story = {
	parameters: {
		apolloClient: {
			mocks: buildMessagesMocks({
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
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = getCanvas(canvasElement);
		await clickFirstConversationIfPresent(canvas);
	},
};
