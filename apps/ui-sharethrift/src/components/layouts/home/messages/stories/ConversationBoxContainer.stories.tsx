import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import {
	ConversationBoxContainerConversationDocument,
	ConversationBoxContainerSendMessageDocument,
} from '../../../../../generated.tsx';
import { withMockApolloClient, withMockUserId } from '../../../../../test-utils/storybook-decorators.tsx';
import { ConversationBoxContainer } from '../components/conversation-box.container.tsx';
import { buildConversationMock, buildSendMessageMock } from '../test-data/conversation';

// #region Shared Mock Data
const mockConversationDetail = buildConversationMock();

// Shared base conversation mock
const conversationMock = {
	request: {
		query: ConversationBoxContainerConversationDocument,
		variables: () => true,
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
			variables: () => true,
		},
		maxUsageCount: Number.POSITIVE_INFINITY,
		result: buildSendMessageMock('success'),
	},
];

// Mocks for message send error (application level)
const sendMessageErrorMocks = [
	conversationMock,
	{
		request: {
			query: ConversationBoxContainerSendMessageDocument,
			variables: () => true,
		},
		maxUsageCount: Number.POSITIVE_INFINITY,
		result: buildSendMessageMock('error'),
	},
];

// Mocks for network error
const sendMessageNetworkErrorMocks = [
	conversationMock,
	{
		request: {
			query: ConversationBoxContainerSendMessageDocument,
			variables: () => true,
		},
		maxUsageCount: Number.POSITIVE_INFINITY,
		...buildSendMessageMock('networkError'),
	},
];

// Mocks for cache update test (empty messages initially)
const cacheUpdateMocks = [
	{
		request: {
			query: ConversationBoxContainerConversationDocument,
			variables: () => true,
		},
		maxUsageCount: Number.POSITIVE_INFINITY,
		result: {
			data: {
				conversation: buildConversationMock({ messages: [] }),
			},
		},
	},
	{
		request: {
			query: ConversationBoxContainerSendMessageDocument,
			variables: () => true,
		},
		maxUsageCount: Number.POSITIVE_INFINITY,
		result: buildSendMessageMock('success', 'First message'),
	},
];
// #endregion Shared Mock Data

const meta: Meta<typeof ConversationBoxContainer> = {
	title: 'Components/Messages/ConversationBoxContainer',
	component: ConversationBoxContainer,
	decorators: [withMockApolloClient, withMockUserId('user-1')],
	parameters: {
		layout: 'fullscreen',
	},
  tags: ['!dev'], // not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags
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
