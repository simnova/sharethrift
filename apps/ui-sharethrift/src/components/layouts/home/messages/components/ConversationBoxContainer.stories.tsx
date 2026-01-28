import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import {
	ConversationBoxContainerConversationDocument,
	ConversationBoxContainerSendMessageDocument,
} from '../../../../../generated.tsx';
import { withMockApolloClient, withMockRouter, withMockUserId } from '../../../../../test-utils/storybook-decorators.tsx';
import { ConversationBoxContainer } from '../components/conversation-box.container.tsx';
import type { Conversation } from '../../../../../generated.tsx';


const createConversationMock = (
	overrides?: Partial<Conversation> & { messages?: Conversation['messages'] },
): Conversation => {
	const defaultConversation: Conversation = {
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

	return {
		...defaultConversation,
		...overrides,
		messages: overrides?.messages ?? defaultConversation.messages,
	};
};

const createSendMessageMock = (
	mode: 'success' | 'error' | 'networkError',
	messageContent: string = 'Test message',
) => {
	const content = messageContent;

	if (mode === 'networkError') {
		return { error: new Error('Network error') };
	}

	const baseResponse = {
		__typename: 'SendMessageMutationResult' as const,
		status: {
			__typename: 'MutationStatus' as const,
			success: mode === 'success',
			errorMessage: mode === 'error' ? 'Failed to send message' : null,
		},
		message:
			mode === 'success'
				? {
						__typename: 'Message' as const,
						id: 'msg-new',
						messagingMessageId: 'SM999',
						content,
						createdAt: new Date().toISOString(),
						authorId: 'user-1',
				  }
				: null,
	};

	return { data: { sendMessage: baseResponse } };
};

// #region Shared Mock Data
const mockConversationDetail = createConversationMock();

// Shared base conversation mock
const conversationMock = {
	request: {
		query: ConversationBoxContainerConversationDocument,
		variables: { conversationId: 'conv-1' },
	},
	maxUsageCount: Number.POSITIVE_INFINITY,
	result: {
		data: { conversation: mockConversationDetail },
	},
};

// Default mocks with just the conversation query
const defaultMocks = [conversationMock];

// Mocks for successful message send
const sendMessageSuccessMocks = [
	conversationMock,
	{
		request: {
			query: ConversationBoxContainerSendMessageDocument,
			variables: { input: { conversationId: 'conv-1', content: 'Test message' } },
		},
		maxUsageCount: Number.POSITIVE_INFINITY,
		result: createSendMessageMock('success'),
	},
];

// Mocks for message send error (application level)
const sendMessageErrorMocks = [
	conversationMock,
	{
		request: {
			query: ConversationBoxContainerSendMessageDocument,
			variables: { input: { conversationId: 'conv-1', content: 'This will fail' } },
		},
		maxUsageCount: Number.POSITIVE_INFINITY,
		result: createSendMessageMock('error'),
	},
];

// Mocks for network error
const sendMessageNetworkErrorMocks = [
	conversationMock,
	{
		request: {
			query: ConversationBoxContainerSendMessageDocument,
			variables: { input: { conversationId: 'conv-1', content: 'Network will fail' } },
		},
		maxUsageCount: Number.POSITIVE_INFINITY,
		...createSendMessageMock('networkError'),
	},
];

// Mocks for cache update test (empty messages initially)
const cacheUpdateMocks = [
	{
		request: {
			query: ConversationBoxContainerConversationDocument,
			variables: { conversationId: 'conv-1' },
		},
		maxUsageCount: Number.POSITIVE_INFINITY,
		result: {
			data: {
				conversation: createConversationMock({ messages: [] }),
			},
		},
	},
	{
		request: {
			query: ConversationBoxContainerSendMessageDocument,
			variables: { input: { conversationId: 'conv-1', content: 'First message' } },
		},
		maxUsageCount: Number.POSITIVE_INFINITY,
		result: createSendMessageMock('success', 'First message'),
	},
];
// #endregion Shared Mock Data

const meta: Meta<typeof ConversationBoxContainer> = {
	title: 'Components/Messages/ConversationBoxContainer',
	component: ConversationBoxContainer,
	decorators: [withMockApolloClient, withMockRouter(), withMockUserId('user-1')],
	parameters: {
		layout: 'fullscreen',
	},
  tags: ['!dev'], // functional testing story, not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags
};
export default meta;
type Story = StoryObj<typeof ConversationBoxContainer>;

export const Default: Story = {
	args: {
		selectedConversationId: 'conv-1',
	},
	parameters: {
		apolloClient: {
			mocks: defaultMocks,
		},
	},
	play:  async ({ canvasElement }) => {
		const canvas = within(canvasElement);
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
			mocks: sendMessageSuccessMocks,
		},
	},
	play:  async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const textArea = await canvas.findByPlaceholderText(/Type a message/i);
		await userEvent.type(textArea, 'Test message');
		const sendButton = canvas.getByRole('button', { name: /send/i });
		await userEvent.click(sendButton);
	},
};

export const SendMessageError: Story = {
	args: {
		selectedConversationId: 'conv-1',
	},
	parameters: {
		apolloClient: {
			mocks: sendMessageErrorMocks,
		},
	},
	play:  async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const textArea = await canvas.findByPlaceholderText(/Type a message/i);
		await userEvent.type(textArea, 'This will fail');
		const sendButton = canvas.getByRole('button', { name: /send/i });
		await userEvent.click(sendButton);
	},
};

export const SendMessageNetworkError: Story = {
	args: {
		selectedConversationId: 'conv-1',
	},
	parameters: {
		apolloClient: {
			mocks: sendMessageNetworkErrorMocks,
		},
	},
	play:  async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const textArea = await canvas.findByPlaceholderText(/Type a message/i);
		await userEvent.type(textArea, 'Network will fail');
		const sendButton = canvas.getByRole('button', { name: /send/i });
		await userEvent.click(sendButton);
	},
};

export const CacheUpdateOnSuccess: Story = {
	args: {
		selectedConversationId: 'conv-1',
	},
	parameters: {
		apolloClient: {
			mocks: cacheUpdateMocks,
		},
	},
	play:  async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const textArea = await canvas.findByPlaceholderText(/Type a message/i);
		await userEvent.type(textArea, 'First message');
		const sendButton = canvas.getByRole('button', { name: /send/i });
		await userEvent.click(sendButton);
	},
};

export const CreateConversationMock: Story = {
	args: {
		selectedConversationId: 'conv-1',
	},
	parameters: {
		apolloClient: {
			mocks: defaultMocks,
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// ListingBanner shows "{firstName}'s Listing"
		await expect(
			await canvas.findByText(/John's Listing/i),
		).toBeInTheDocument();
	},
};
