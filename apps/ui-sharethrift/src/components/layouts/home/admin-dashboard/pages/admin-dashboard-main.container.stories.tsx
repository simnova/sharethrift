import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import {
	withMockApolloClient,
	withMockRouter,
} from '../../../../../test-utils/storybook-decorators.tsx';
import {
	AdminListingsTableContainerAdminListingsDocument,
	AdminUsersTableContainerAllUsersDocument,
} from '../../../../../generated.tsx';
import { HomeRoutes } from '../../index.tsx';
import { userIsAdminMockRequest } from '../../../../../test-utils/storybook-helpers.ts';

const meta: Meta<typeof HomeRoutes> = {
	title: 'Pages/Admin Dashboard',
	component: HomeRoutes,
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
						variables: { page: 1, pageSize: 6 },
					},
					result: {
						data: {
							allUsers: {
								items: [
									{
										id: 'user-1',
										email: 'test@example.com',
										firstName: 'John',
										lastName: 'Doe',
										roleNames: ['User'],
										isBlocked: false,
									},
								],
								total: 1,
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
		const adminDashboardText = await canvas.findByRole('heading', { name: /Admin Dashboard/i });
		expect(adminDashboardText).toBeTruthy();
	},
};
