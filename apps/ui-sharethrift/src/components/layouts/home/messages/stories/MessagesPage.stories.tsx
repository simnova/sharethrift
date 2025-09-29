import type { Meta, StoryObj } from '@storybook/react';
import { Messages } from '../components/messages.tsx';

const meta: Meta<typeof Messages> = {
	title: 'Pages/MessagesPage',
	component: Messages,
};
export default meta;
type Story = StoryObj<typeof Messages>;

export const Default: Story = {
	args: {},
};
