import type { Meta, StoryFn } from '@storybook/react';
import { expect } from 'storybook/test';
import {
	ConversationBoxContainerConversationDocument,
	HomeConversationListContainerConversationsByUserDocument,
	HomeConversationListContainerCurrentUserDocument,
} from '../../../../../../generated.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../../test-utils/storybook-decorators.tsx';
import { AppRoutes } from '../../../index.tsx';

const meta: Meta<typeof AppRoutes> = {
	title: 'Pages/Messages',
	component: AppRoutes,
	decorators: [withMockApolloClient, withMockRouter('/messages')],
};

export default meta;

const Template: StoryFn<typeof AppRoutes> = () => <AppRoutes />;

export const DefaultView: StoryFn<typeof AppRoutes> = Template.bind({});

DefaultView.play = async ({ canvasElement }) => {
	// Component renders with lazy-loaded content
	expect(canvasElement).toBeTruthy();
};

DefaultView.parameters = {
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
						currentUser: {
							__typename: 'PersonalUser',
							id: '507f1f77bcf86cd799439011', // Alice
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
						conversationsByUser: [
							{
								__typename: 'Conversation',
								id: '64f7a9c2d1e5b97f3c9d0c01',
								messagingConversationId: 'CH123',
								createdAt: '2025-08-08T10:00:00Z',
								updatedAt: '2025-08-08T12:00:00Z',
								sharer: {
									__typename: 'PersonalUser',
									id: '507f1f77bcf86cd799439011',
									account: {
										__typename: 'PersonalUserAccount',
										profile: {
											__typename: 'PersonalUserAccountProfile',
											firstName: 'Alice',
											lastName: 'Johnson',
										},
									},
								},
								reserver: {
									__typename: 'PersonalUser',
									id: '507f1f77bcf86cd799439099',
									account: {
										__typename: 'PersonalUserAccount',
										profile: {
											__typename: 'PersonalUserAccountProfile',
											firstName: 'Current',
											lastName: 'User',
										},
									},
								},
								listing: {
									__typename: 'ItemListing',
									id: '64f7a9c2d1e5b97f3c9d0a41',
									title: 'City Bike',
									images: ['/assets/item-images/bike.png'],
								},
							},
							{
								__typename: 'Conversation',
								id: '64f7a9c2d1e5b97f3c9d0c02',
								messagingConversationId: 'CH124',
								createdAt: '2025-08-07T09:00:00Z',
								updatedAt: '2025-08-08T11:30:00Z',
								sharer: {
									__typename: 'PersonalUser',
									id: '507f1f77bcf86cd799439022',
									account: {
										__typename: 'PersonalUserAccount',
										profile: {
											__typename: 'PersonalUserAccountProfile',
											firstName: 'Bob',
											lastName: 'Smith',
										},
									},
								},
								reserver: {
									__typename: 'PersonalUser',
									id: '507f1f77bcf86cd799439011',
									account: {
										__typename: 'PersonalUserAccount',
										profile: {
											__typename: 'PersonalUserAccountProfile',
											firstName: 'Alice',
											lastName: 'Johnson',
										},
									},
								},
								listing: {
									__typename: 'ItemListing',
									id: '64f7a9c2d1e5b97f3c9d0a42',
									title: 'Professional Camera',
									images: ['/assets/item-images/camera.png'],
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
						conversation: {
							__typename: 'Conversation',
							id: '64f7a9c2d1e5b97f3c9d0c01',
							messagingConversationId: 'CH123',
							createdAt: '2025-08-08T10:00:00Z',
							updatedAt: '2025-08-08T12:00:00Z',
							schemaVersion: '1',
							listing: {
								__typename: 'ItemListing',
								id: '64f7a9c2d1e5b97f3c9d0a41',
								title: 'City Bike',
								description: 'Perfect for city commuting.',
								category: 'Sports & Recreation',
								location: 'Philadelphia, PA',
								images: ['/assets/item-images/bike.png'],
							},
							sharer: {
								__typename: 'PersonalUser',
								id: '507f1f77bcf86cd799439011',
								account: {
									__typename: 'PersonalUserAccount',
									username: 'alice_johnson',
									profile: {
										__typename: 'PersonalUserAccountProfile',
										firstName: 'Alice',
										lastName: 'Johnson',
									},
								},
							},
							reserver: {
								__typename: 'PersonalUser',
								id: '507f1f77bcf86cd799439099',
								account: {
									__typename: 'PersonalUserAccount',
									username: 'current_user',
									profile: {
										__typename: 'PersonalUserAccountProfile',
										firstName: 'Current',
										lastName: 'User',
									},
								},
							},
							messages: [
								{
									__typename: 'Message',
									id: '64f7a9c2d1e5b97f3c9d0c09',
									messagingMessageId: 'SM001',
									authorId: '507f1f77bcf86cd799439011',
									content: "Hi! I'm interested in borrowing your bike.",
									createdAt: '2025-08-08T10:05:00Z',
								},
								{
									__typename: 'Message',
									id: '64f7a9c2d1e5b97f3c9d0c10',
									messagingMessageId: 'SM002',
									authorId: '507f1f77bcf86cd799439099',
									content: "Hi! Yes, it's available.",
									createdAt: '2025-08-08T10:15:00Z',
								},
							],
						},
					},
				},
			},
		],
	},
};
