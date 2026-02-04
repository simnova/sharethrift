import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { ConversationList } from './components/layouts/app/pages/messages/components/conversation-list.tsx';

const meta: Meta<typeof ConversationList> = {
	title: 'Components/Messages/ConversationList',
	component: ConversationList,
	argTypes: {
		onConversationSelect: { action: 'conversation selected' },
	},
};
export default meta;
type Story = StoryObj<typeof ConversationList>;

export const Default: Story = {
	args: {
		onConversationSelect: fn(),
		selectedConversationId: '1',
		// conversations: mockConversations,
	},
};

export const WithConversationSelection: Story = {
	args: {
		onConversationSelect: fn(),
		selectedConversationId: '1',
	},
};
