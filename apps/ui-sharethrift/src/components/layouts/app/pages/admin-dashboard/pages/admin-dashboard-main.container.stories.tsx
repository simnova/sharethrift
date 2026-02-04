import type { Meta, StoryObj } from '@storybook/react';
import { AppRoutes } from '../../..';
import { withMockApolloClient,withMockRouter } from '../../../../../../test-utils/storybook-decorators';
import { AdminListingsTableContainerAdminListingsDocument,AdminUsersTableContainerAllUsersDocument } from '../../../../../../generated.tsx';
import { userIsAdminMockRequest } from '../../../../../../test-utils/storybook-helpers';
import { expect, within } from 'storybook/test';



const meta: Meta<typeof AppRoutes> = {
	title: 'Pages/Admin Dashboard',
	component: AppRoutes,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [withMockApolloClient, withMockRouter('/admin-dashboard')],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminListingsTableContainerAdminListingsDocument,
						variables: { page: 1, pageSize: 6, statusFilters: ['Blocked'] },
					},
          maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							adminListings: {
								items: [
									{
										id: 'listing-1',
										__typename: 'ListingAll',
										title: 'Test Listing',
										images: ['https://example.com/image.jpg'],
										createdAt: '2024-01-01T00:00:00Z',
										sharingPeriodStart: '2024-01-15',
										sharingPeriodEnd: '2024-02-15',
										state: 'Blocked',
									},
								],
								total: 1,
								page: 1,
								pageSize: 6,
							},
						},
					},
				},
				{
					request: {
						query: AdminUsersTableContainerAllUsersDocument,
						variables: {
							page: 1,
							pageSize: 50,
							searchText: '',
							statusFilters: [],
						},
					},
          maxUsageCount: Number.POSITIVE_INFINITY,
					result: {
						data: {
							allUsers: {
								items: [
									{
										__typename: 'PersonalUser',
										id: 'user-1',
										email: 'test@example.com',
										firstName: 'John',
										lastName: 'Doe',
										roleNames: ['User'],
										isBlocked: false,
										createdAt: '2024-01-01T00:00:00Z',
										userType: 'personal-user',
										account: {
											username: 'johndoe',
											email: 'test@example.com',
											profile: {
												firstName: 'John',
												lastName: 'Doe',
											},
										},
									},
								],
								total: 1,
								page: 1,
								pageSize: 50,
							},
						},
					},
				},
				userIsAdminMockRequest('admin-user', true),
			],
		},
	},
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		// make sure that everything rendered already and wait for async queries
		expect(canvasElement).toBeTruthy();
		const canvas = within(canvasElement);
		// wait for the admin dashboard H1 heading to appear after Apollo mocks resolve
		const adminDashboardText = await canvas.findByRole('heading', {
			name: /Admin Dashboard/i,
		});
		expect(adminDashboardText).toBeTruthy();
	},
};
