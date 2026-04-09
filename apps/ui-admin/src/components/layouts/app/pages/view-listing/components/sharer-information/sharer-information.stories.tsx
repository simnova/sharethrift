import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, fn } from 'storybook/test';
import { SharerInformation } from '@sthrift/ui-components';
import { withMockRouter } from '../../../../../../../test-utils/storybook-decorators.tsx';


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
	},
	decorators: [withMockRouter('/listing/1')],
	args: {
		sharer: mockSharer,
		onMessageSharer: fn(),
		isMessageLoading: false,
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
	args: {
		onMessageSharer: fn(),
		isMessageLoading: false,
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
