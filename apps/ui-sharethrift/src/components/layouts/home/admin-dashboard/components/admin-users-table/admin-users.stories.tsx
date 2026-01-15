import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { AdminUsers } from './admin-users.tsx';
import { withMockApolloClient, withMockRouter } from '../../../../../../test-utils/storybook-decorators.tsx';
import {
	AdminUsersTableContainerAllUsersDocument,
	BlockUserDocument,
	UnblockUserDocument,
} from '../../../../../../generated.tsx';

const meta: Meta<typeof AdminUsers> = {
	title: 'Components/AdminUsers',
	component: AdminUsers,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminUsersTableContainerAllUsersDocument,
						variables: {
							page: 1,
							pageSize: 50,
							searchText: '',
							statusFilters: [],
							sorter: undefined,
						},
					},
					result: {
						data: {
							allUsers: {
								__typename: 'AdminUserSearchResults',
								items: [
									{
										__typename: 'AdminUser',
										id: 'user-1',
										username: 'john_doe',
										firstName: 'John',
										lastName: 'Doe',
										accountCreated: '2024-01-15T10:30:00Z',
										status: 'verified-personal',
										isBlocked: false,
									},
									{
										__typename: 'AdminUser',
										id: 'user-2',
										username: 'jane_smith',
										firstName: 'Jane',
										lastName: 'Smith',
										accountCreated: '2024-02-20T14:45:00Z',
										status: 'verified-organization',
										isBlocked: false,
									},
								],
								total: 2,
							},
						},
					},
				},
				{
					request: {
						query: BlockUserDocument,
					},
					result: {
						data: {
							blockUser: {
								__typename: 'MutationStatus',
								success: true,
								errorMessage: null,
							},
						},
					},
				},
				{
					request: {
						query: UnblockUserDocument,
					},
					result: {
						data: {
							unblockUser: {
								__typename: 'MutationStatus',
								success: true,
								errorMessage: null,
							},
						},
					},
				},
			],
		},
	},
	decorators: [withMockApolloClient, withMockRouter('/account/admin-dashboard')],
} satisfies Meta<typeof AdminUsers>;

export default meta;
type Story = StoryObj<typeof AdminUsers>;

export const Default: Story = {
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};
