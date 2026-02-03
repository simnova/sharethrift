import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { AdminDashboardMain } from './admin-dashboard-main.tsx';
import { withMockApolloClient,withMockRouter } from '../../../../../../test-utils/storybook-decorators.tsx';
import { AdminListingsTableContainerAdminListingsDocument,AdminUsersTableContainerAllUsersDocument } from '../../../../../../generated.tsx';

const meta: Meta<typeof AdminDashboardMain> = {
	title: 'Pages/AdminDashboardMain',
	component: AdminDashboardMain,
	parameters: {
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminListingsTableContainerAdminListingsDocument,
					},
					variableMatcher: () => true,
					result: {
						data: {
							adminListings: {
								items: [
									{
										id: 'listing-1',
										title: 'Test Listing',
									images: ['https://example.com/image.jpg'],
										createdAt: '2024-01-01T00:00:00Z',
										sharingPeriodStart: '2024-01-15',
										sharingPeriodEnd: '2024-02-15',
										state: 'Blocked',
									},
								],
								total: 1,
							},
						},
					},
				},
				{
					request: {
						query: AdminUsersTableContainerAllUsersDocument,
					},
					variableMatcher: () => true,
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
			],
		},
	},
	decorators: [withMockApolloClient, withMockRouter('/account/admin-dashboard')],
};

export default meta;
type Story = StoryObj<typeof AdminDashboardMain>;

export const Default: Story = {
	play: ({ canvasElement }: { canvasElement: HTMLElement }) => {
		expect(canvasElement).toBeTruthy();
		const tabs = canvasElement.querySelectorAll('[role="tab"]');
		expect(tabs.length).toBeGreaterThan(0);
	},
};
