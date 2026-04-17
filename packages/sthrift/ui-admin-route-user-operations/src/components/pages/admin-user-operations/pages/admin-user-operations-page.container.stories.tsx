import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, waitFor } from 'storybook/test';
import { AdminUserOperationsPage } from './admin-user-operations-page.tsx';
import {
	withMockApolloClient,
	withMockRouter,
} from '@sthrift/ui-admin-route-shared/test-utils';
import { AdminUsersTableContainerAdminDashboardUsersDocument } from '../../../../generated.tsx';

const meta: Meta<typeof AdminUserOperationsPage> = {
	title: 'Pages/AdminUserOperationsPage',
	component: AdminUserOperationsPage,
	parameters: {
		a11y: { disable: true },
		layout: 'fullscreen',
		apolloClient: {
			mocks: [
				{
					request: {
						query: AdminUsersTableContainerAdminDashboardUsersDocument,
					},
					variableMatcher: () => true,
					result: {
						data: {
							adminDashboardUsers: {
								items: [
									{
										id: 'user-1',
										createdAt: '2024-01-01T00:00:00Z',
										userType: 'personal-user',
										isBlocked: false,
										account: {
											username: 'john_doe',
											email: 'john.doe@example.com',
											profile: {
												firstName: 'John',
												lastName: 'Doe',
											},
										},
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
	decorators: [
		withMockApolloClient,
		withMockRouter('/account/admin-user-operations'),
	],
};

export default meta;
type Story = StoryObj<typeof AdminUserOperationsPage>;

export const Default: Story = {
	play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
		const canvas = within(canvasElement);
		await waitFor(
			() => {
				expect(canvas.getByText('User Operations')).toBeTruthy();
				expect(canvas.getByText('john_doe')).toBeTruthy();
			},
			{ timeout: 3000 },
		);
		const tabs = canvasElement.querySelectorAll('[role="tab"]');
		expect(tabs.length).toBe(0);
	},
};
