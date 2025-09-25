import type { Meta, StoryObj } from '@storybook/react';
import { ConversationList } from '../components/conversation-list.tsx';



const meta: Meta<typeof ConversationList> = {
	title: 'Messages/ConversationList',
	component: ConversationList,
};
export default meta;
type Story = StoryObj<typeof ConversationList>;

export const Default: Story = {
	args: {
		onConversationSelect: () => {
			console.log('Conversation selected');
		},
		selectedConversationId: '1',
		// conversations: mockConversations,
	},
};
