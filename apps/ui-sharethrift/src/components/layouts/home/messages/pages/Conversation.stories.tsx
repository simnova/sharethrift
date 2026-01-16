import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { Conversation } from './Conversation.tsx';

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
  tags: ['!dev'], // temporarily hidden until the component is ready - https://storybook.js.org/docs/writing-stories/tags
} satisfies Meta<typeof Conversation>;

export default meta;
type Story = StoryObj<typeof Conversation>;

export const Default: Story = {
	name: 'Default',
	play:  ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
		const content = canvasElement.textContent;
		expect(content).toContain('Conversation Page');
	},
};
