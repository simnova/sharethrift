import type { Meta, StoryObj } from '@storybook/react';
import { UserAppeal } from './user-appeal';

const meta = {
	title: 'Layouts/Home/Account/Profile/Components/UserAppeal',
	component: UserAppeal,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof UserAppeal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotBlocked: Story = {
	args: {
		isBlocked: false,
		onSubmitAppeal: () => {},
	},
};

export const BlockedNoAppeal: Story = {
	args: {
		isBlocked: true,
		existingAppeal: null,
		onSubmitAppeal: (reason: string) => {
			console.log('Submitted appeal:', reason);
		},
	},
};

export const AppealPending: Story = {
	args: {
		isBlocked: true,
		existingAppeal: {
			id: '1',
			reason:
				'I believe my account was blocked by mistake. I have always followed the community guidelines and treated other users with respect. I would appreciate a review of my case.',
			state: 'requested',
			createdAt: new Date().toISOString(),
		},
		onSubmitAppeal: () => {},
	},
};

export const AppealAccepted: Story = {
	args: {
		isBlocked: true,
		existingAppeal: {
			id: '2',
			reason:
				'I apologize for the late return of the borrowed item. There was a family emergency that prevented me from returning it on time. I have since returned the item and would like to regain access to my account.',
			state: 'accepted',
			createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
		},
		onSubmitAppeal: () => {},
	},
};

export const AppealDenied: Story = {
	args: {
		isBlocked: true,
		existingAppeal: {
			id: '3',
			reason:
				'I disagree with the block decision. I did not violate any rules.',
			state: 'denied',
			createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
		},
		onSubmitAppeal: () => {},
	},
};

export const Loading: Story = {
	args: {
		isBlocked: true,
		existingAppeal: null,
		onSubmitAppeal: () => {},
		loading: true,
	},
};
