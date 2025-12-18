import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent } from 'storybook/test';
import { SharerInformation } from './sharer-information.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../../test-utils/storybook-decorators.tsx';
import {
	CreateConversationDocument,
	HomeConversationListContainerConversationsByUserDocument,
} from '../../../../../../generated.tsx';

const mockSharer = {
	id: 'user-1',
	name: 'John Doe',
	avatar: undefined,
};

const meta: Meta<typeof SharerInformation> = {
	title: 'Components/SharerInformation',
	component: SharerInformation,
	parameters: {
		layout: 'padded',
		apolloClient: {
			mocks: [
				{
					request: {
						query: CreateConversationDocument,
						variables: {
							input: {
								listingId: '1',
								sharerId: 'user-1',
								reserverId: 'user-2',
							},
						},
					},
					result: {
						data: {
							createConversation: {
								__typename: 'ConversationMutationResult',
								status: { success: true, errorMessage: null },
								conversation: { __typename: 'Conversation', id: 'conv-1' },
							},
						},
					},
				},
				{
					request: {
						query: HomeConversationListContainerConversationsByUserDocument,
						variables: { userId: 'user-2' },
					},
					result: {
						data: {
							conversationsByUser: [],
						},
					},
				},
			],
		},
	},
	decorators: [withMockApolloClient, withMockRouter('/listing/1')],
	args: {
		sharer: mockSharer,
		listingId: '1',
		isOwner: false,
		sharedTimeAgo: '2 days ago',
		currentUserId: 'user-2',
	},
};

export default meta;
type Story = StoryObj<typeof SharerInformation>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const OwnerView: Story = {
	args: {
		isOwner: true,
		currentUserId: 'user-1',
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithoutCurrentUser: Story = {
	args: {
		currentUserId: null,
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const RecentlyShared: Story = {
	args: {
		sharedTimeAgo: '1h ago',
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const LongTimeAgo: Story = {
	args: {
		sharedTimeAgo: '3 months ago',
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const ClickMessageButton: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const messageButton = canvas.queryByRole('button', { name: /Message/i });
		if (messageButton) {
			await userEvent.click(messageButton);
		}
	},
};

export const MessageButtonWithError: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: CreateConversationDocument,
						variables: () => true,
					},
					maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							createConversation: {
								__typename: 'ConversationMutationResult',
								status: { success: false, errorMessage: 'Failed to create' },
								conversation: null,
							},
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
		const canvas = within(canvasElement);
		await expect(canvasElement).toBeTruthy();
		const messageButton = canvas.queryByRole('button', { name: /Message/i });
		if (messageButton) {
			await userEvent.click(messageButton);
		}
	},
};

export const WithBlockListingElement: Story = {
	args: {
		blockListingElement: (
			<div style={{ display: 'flex', gap: 8 }}>
				<button style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #d9d9d9' }}>
					Block Listing
				</button>
			</div>
		),
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
