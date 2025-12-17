import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import {
	ConversationBoxContainerConversationDocument,
	ConversationBoxContainerSendMessageDocument,
} from '../../../../../generated.tsx';
import { withMockApolloClient, withMockUserId } from '../../../../../test-utils/storybook-decorators.tsx';
import { ConversationBoxContainer } from '../components/conversation-box.container.tsx';

// #region Mock Data
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
};
// #endregion Mock Data

// #region Mock Factory
/**
 * Factory function to build Apollo mocks with sensible defaults.
 * Reduces duplication across stories while allowing per-story overrides.
 */
const buildMocks = ({
	conversation = mockConversationDetail,
	conversationDelay,
	sendMessageResult,
}: {
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
	sendMessageError?: Error;
} = {}) => {
	const baseMocks = [
		{
			request: {
				query: ConversationBoxContainerConversationDocument,
				variables: () => true,
			},
			maxUsageCount: Number.POSITIVE_INFINITY,
			...(conversationDelay ? { delay: conversationDelay } : {}),
			result: {
				data: {
					conversation,
				},
			},
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
			result: {
				data: {
					sendMessage: sendMessageResult,
				},
			},
		},
	];
};

/**
 * Factory to build a network error mock for sendMessage.
 */
const buildNetworkErrorMocks = (conversation = mockConversationDetail) => [
	{
		request: {
			query: ConversationBoxContainerConversationDocument,
			variables: () => true,
		},
		maxUsageCount: Number.POSITIVE_INFINITY,
		result: {
			data: {
				conversation,
			},
		},
	},
	{
		request: {
			query: ConversationBoxContainerSendMessageDocument,
			variables: () => true,
		},
		maxUsageCount: Number.POSITIVE_INFINITY,
		error: new Error('Network error'),
	},
];
// #endregion Mock Factory

// #region Play Helpers
const getCanvas = (canvasElement: HTMLElement) => within(canvasElement);

const typeAndSendMessage = async (
	canvas: ReturnType<typeof within>,
	message: string,
) => {
	const textArea = await canvas.findByPlaceholderText(/Type a message/i);
	await userEvent.type(textArea, message);
	const sendButton = canvas.getByRole('button', { name: /send/i });
	await userEvent.click(sendButton);
};
// #endregion Play Helpers

const meta: Meta<typeof ConversationBoxContainer> = {
	title: 'Pages/Home/Messages/ConversationBoxContainer',
	component: ConversationBoxContainer,
	decorators: [withMockApolloClient, withMockUserId('user-1')],
	parameters: {
		layout: 'fullscreen',
	},
};
export default meta;
type Story = StoryObj<typeof ConversationBoxContainer>;

export const Default: Story = {
	args: {
		selectedConversationId: 'conv-1',
	},
	parameters: {
		apolloClient: {
			mocks: buildMocks(),
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = getCanvas(canvasElement);
		// ListingBanner shows "{firstName}'s Listing"
		await expect(
			await canvas.findByText(/John's Listing/i),
		).toBeInTheDocument();
	},
};

export const SendMessageSuccess: Story = {
	args: {
		selectedConversationId: 'conv-1',
	},
	parameters: {
		apolloClient: {
			mocks: buildMocks({
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
						messagingMessageId: 'SM999',
						content: 'Test message',
						createdAt: new Date().toISOString(),
						authorId: 'user-1',
					},
				},
			}),
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = getCanvas(canvasElement);
		await typeAndSendMessage(canvas, 'Test message');
	},
};

export const SendMessageError: Story = {
	args: {
		selectedConversationId: 'conv-1',
	},
	parameters: {
		apolloClient: {
			mocks: buildMocks({
				sendMessageResult: {
					__typename: 'SendMessageMutationResult',
					status: {
						__typename: 'MutationStatus',
						success: false,
						errorMessage: 'Failed to send message',
					},
					message: null,
				},
			}),
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = getCanvas(canvasElement);
		await typeAndSendMessage(canvas, 'This will fail');
	},
};

export const SendMessageNetworkError: Story = {
	args: {
		selectedConversationId: 'conv-1',
	},
	parameters: {
		apolloClient: {
			mocks: buildNetworkErrorMocks(),
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = getCanvas(canvasElement);
		await typeAndSendMessage(canvas, 'Network will fail');
	},
};

export const CacheUpdateOnSuccess: Story = {
	args: {
		selectedConversationId: 'conv-1',
	},
	parameters: {
		apolloClient: {
			mocks: buildMocks({
				conversation: { ...mockConversationDetail, messages: [] },
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
						messagingMessageId: 'SM999',
						content: 'First message',
						createdAt: new Date().toISOString(),
						authorId: 'user-1',
					},
				},
			}),
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = getCanvas(canvasElement);
		await typeAndSendMessage(canvas, 'First message');
	},
};
