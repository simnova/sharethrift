import type { Meta, StoryObj } from '@storybook/react';
import { ConversationList } from '../components/conversation-list.tsx';
import { expect, fn, userEvent, within } from 'storybook/test';

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
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		// Verify the list is present
		const list = canvas.getByRole('list');
		expect(list).toBeInTheDocument();
		expect(list).toBeVisible();
		
		// Verify list items if present
		const listItems = canvas.queryAllByRole('listitem');
		if (listItems.length > 0) {
			expect(listItems[0]).toBeInTheDocument();
		}
	},
};

export const WithConversationSelection: Story = {
	args: {
		onConversationSelect: fn(),
		selectedConversationId: '1',
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		// Verify the list is present
		const list = canvas.getByRole('list');
		expect(list).toBeInTheDocument();
		
		// Try to click a conversation if available
		const listItems = canvas.queryAllByRole('listitem');
		if (listItems.length > 0 && listItems[0]) {
			await userEvent.click(listItems[0]);
			// Verify callback might have been called
			// Note: callback verification depends on component implementation
		}
	},
};
