import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { ConversationList } from './conversation-list';
import type { ItemListing, Message, PersonalUser, Conversation } from '../../../../../../generated';

const meta: Meta<typeof ConversationList> = {
	title: 'Components/Messages/ConversationList',
	component: ConversationList,
	argTypes: {
		onConversationSelect: { action: 'conversation selected' },
	},
	parameters: {
		layout: 'fullscreen',
	},
};
export default meta;

const mockListing: ItemListing = {
	__typename: 'ItemListing',
	id: 'listing1',
	category: 'Books',
	description: 'A classic novel',
	location: 'New York',
	title: 'Moby Dick',
	listingType: 'share',
	sharingPeriodStart: new Date().toISOString(),
	sharingPeriodEnd: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

const mockUser: PersonalUser = {
	__typename: 'PersonalUser',
	id: 'user1',
	account: {
		__typename: 'PersonalUserAccount',
		email: 'user1@example.com',
		username: 'user1',
		profile: {
			__typename: 'PersonalUserAccountProfile',
			firstName: 'Alice',
			lastName: 'Smith',
		},
	},
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
	userType: 'personal',
};

const mockMessages: Message[] = [
	{
		__typename: 'Message',
		id: 'msg1',
		authorId: 'user1',
		content: 'Hello!',
		createdAt: new Date().toISOString(),
		messagingMessageId: 'm1',
	},
	{
		__typename: 'Message',
		id: 'msg2',
		authorId: 'user2',
		content: 'Hi there!',
		createdAt: new Date().toISOString(),
		messagingMessageId: 'm2',
	},
];

const mockConversations: Conversation[] = [
	{
		__typename: 'Conversation',
		id: 'conv1',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		schemaVersion: '1',
		listing: mockListing,
		messages: mockMessages,
		messagingConversationId: 'conv1',
		reserver: mockUser,
		sharer: mockUser,
	},
	{
		__typename: 'Conversation',
		id: 'conv2',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		schemaVersion: '1',
		listing: { ...mockListing, id: 'listing2', title: '1984' },
		messages: [
			{
				__typename: 'Message',
				id: 'msg3',
				authorId: 'user2',
				content: 'Is this available?',
				createdAt: new Date().toISOString(),
				messagingMessageId: 'm3',
			},
		],
		messagingConversationId: 'conv2',
		reserver: { ...mockUser, id: 'user2', account: { ...mockUser.account, email: 'user2@example.com', username: 'user2' } },
		sharer: mockUser,
	},
];

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		onConversationSelect: fn(),
		conversations: mockConversations,
	},
};

export const WithConversationSelection: Story = {
	args: {
		onConversationSelect: fn(),
		selectedConversationId: '1',
		conversations: mockConversations,
	},
};
