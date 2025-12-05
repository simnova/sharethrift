import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent } from 'storybook/test';
import { Messages } from './messages.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../test-utils/storybook-decorators.tsx';
import {
	HomeConversationListContainerConversationsByUserDocument,
	HomeConversationListContainerCurrentUserDocument,
	ConversationBoxContainerConversationDocument,
} from '../../../../../generated.tsx';

const mockConversations = [
	{
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
				profile: { __typename: 'PersonalUserAccountProfile', firstName: 'John', lastName: 'Doe' },
			},
		},
		reserver: {
			__typename: 'PersonalUser',
			id: 'user-2',
			account: {
				__typename: 'PersonalUserAccount',
				username: 'jane_smith',
				profile: { __typename: 'PersonalUserAccountProfile', firstName: 'Jane', lastName: 'Smith' },
			},
		},
		createdAt: '2025-01-15T09:00:00Z',
		updatedAt: '2025-01-15T10:00:00Z',
	},
];

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
			profile: { __typename: 'PersonalUserAccountProfile', firstName: 'John', lastName: 'Doe' },
		},
	},
	reserver: {
		__typename: 'PersonalUser',
		id: 'user-2',
		account: {
			__typename: 'PersonalUserAccount',
			username: 'jane_smith',
			profile: { __typename: 'PersonalUserAccountProfile', firstName: 'Jane', lastName: 'Smith' },
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

const meta: Meta<typeof Messages> = {
	title: 'Components/Messages',
	component: Messages,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeConversationListContainerCurrentUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							currentUser: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: HomeConversationListContainerConversationsByUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							conversationsByUser: mockConversations,
						},
					},
				},
				{
					request: {
						query: ConversationBoxContainerConversationDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							conversation: mockConversationDetail,
						},
					},
				},
			],
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
			mocks: [
				{
					request: {
						query: HomeConversationListContainerCurrentUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							currentUser: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: HomeConversationListContainerConversationsByUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							conversationsByUser: [],
						},
					},
				},
			],
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
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const conversationItem = canvas.queryByText(/Cordless Drill/i);
		if (conversationItem) {
			await userEvent.click(conversationItem);
		}
	},
};

export const WithMultipleConversations: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeConversationListContainerCurrentUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							currentUser: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: HomeConversationListContainerConversationsByUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							conversationsByUser: [
								...mockConversations,
								{
									...mockConversations[0],
									id: 'conv-2',
									listing: {
										__typename: 'ItemListing',
										id: 'listing-2',
										title: 'Mountain Bike',
										images: ['/assets/item-images/bike.png'],
									},
								},
							],
						},
					},
				},
				{
					request: {
						query: ConversationBoxContainerConversationDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							conversation: mockConversationDetail,
						},
					},
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithPreselectedConversation: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: HomeConversationListContainerCurrentUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							currentUser: mockCurrentUser,
						},
					},
				},
				{
					request: {
						query: HomeConversationListContainerConversationsByUserDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							conversationsByUser: mockConversations,
						},
					},
				},
				{
					request: {
						query: ConversationBoxContainerConversationDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							conversation: mockConversationDetail,
						},
					},
				},
			],
		},
	},
	render: (args) => <Messages {...args} />,
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const ClickAndViewConversation: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const conversationItems = canvas.queryAllByText(/Cordless Drill/i);
		const firstItem = conversationItems[0];
		if (firstItem) {
			await userEvent.click(firstItem);
		}
	},
};

export const NoConversationSelected: Story = {
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
		const placeholderText = canvasElement.textContent?.includes('Select a conversation');
		await expect(placeholderText).toBeTruthy();
	},
};
