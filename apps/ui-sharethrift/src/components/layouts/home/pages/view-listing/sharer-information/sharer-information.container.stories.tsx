import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { SharerInformationContainer } from './sharer-information.container.tsx';
import { SharerInformationContainerDocument } from '../../../../../../generated.tsx';
import { withMockApolloClient,withMockRouter } from '../../../../../../test-utils/storybook-decorators.tsx';

const mockUser = {
	__typename: 'PersonalUser',
	id: 'user-1',
	account: {
		__typename: 'PersonalUserAccount',
		profile: {
			__typename: 'PersonalUserProfile',
			firstName: 'John',
			lastName: 'Doe',
		},
	},
};

const meta: Meta<typeof SharerInformationContainer> = {
	title: 'Containers/SharerInformationContainer',
	component: SharerInformationContainer,
	parameters: {
		layout: 'padded',
		apolloClient: {
			mocks: [
				{
					request: {
						query: SharerInformationContainerDocument,
						variables: { sharerId: 'user-1' },
					},
					result: {
						data: {
							userById: mockUser,
						},
					},
				},
			],
		},
	},
	decorators: [withMockApolloClient, withMockRouter('/listing/1')],
};

export default meta;
type Story = StoryObj<typeof SharerInformationContainer>;

export const Default: Story = {
	args: {
		sharerId: 'user-1',
		listingId: '1',
		isOwner: false,
		sharedTimeAgo: '2h ago',
		currentUserId: 'user-2',
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const OwnerView: Story = {
	args: {
		sharerId: 'user-1',
		listingId: '1',
		isOwner: true,
		sharedTimeAgo: '2h ago',
		currentUserId: 'user-1',
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithNameOnly: Story = {
	args: {
		sharerId: 'John Doe',
		listingId: '1',
		isOwner: false,
		sharedTimeAgo: '1d ago',
		currentUserId: 'user-2',
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};

export const Loading: Story = {
	args: {
		sharerId: 'user-1',
		listingId: '1',
		isOwner: false,
		sharedTimeAgo: '2h ago',
		currentUserId: 'user-2',
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: SharerInformationContainerDocument,
						variables: { sharerId: 'user-1' },
					},
					delay: Infinity,
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		await expect(canvasElement).toBeTruthy();
	},
};
