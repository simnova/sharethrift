import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { Conversation } from './conversation.tsx';

const meta: Meta<typeof Conversation> = {
	title: 'Pages/Messages/Conversation',
	component: Conversation,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: 'Conversation page placeholder component.',
			},
		},
	},
} satisfies Meta<typeof Conversation>;

export default meta;
type Story = StoryObj<typeof Conversation>;

export const Default: Story = {
	name: 'Default',
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
		const content = canvasElement.textContent;
		expect(content).toContain('Conversation Page');
	},
};
