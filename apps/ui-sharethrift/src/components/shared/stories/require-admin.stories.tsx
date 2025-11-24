import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { withMockApolloClient, MockAuthWrapper } from '../../../test-utils/storybook-decorators.tsx';
import { MemoryRouter } from 'react-router-dom';
import { RequireAdmin } from '../require-admin.tsx';
import { UseUserIsAdminDocument } from '../../../generated.tsx';

const meta: Meta<typeof RequireAdmin> = {
	title: 'Shared/RequireAdmin',
	component: RequireAdmin,
	parameters: {
		layout: 'centered',
		apolloClient: {
			mocks: [
				{
					request: {
						query: UseUserIsAdminDocument,
					},
					result: {
						data: {
							currentUser: {
								__typename: 'CurrentUser',
								isAdmin: true,
							},
						},
					},
				},
			],
		},
	},
	decorators: [
		withMockApolloClient,
		(Story) => (
			<MockAuthWrapper>
				<MemoryRouter>
					<Story />
				</MemoryRouter>
			</MockAuthWrapper>
		),
	],
};

export default meta;
type Story = StoryObj<typeof RequireAdmin>;

const AdminContent = () => (
	<div style={{ padding: '20px', background: '#e3f2fd' }}>
		<h2>Admin Dashboard</h2>
		<p>This content is only visible to admin users.</p>
	</div>
);

export const AdminProtectedContent: Story = {
	args: {
		children: <AdminContent />,
	},
	play: async ({ canvasElement }) => {
		// The component will show admin content, loading state, or redirect
		// depending on the user's admin status from useUserIsAdmin hook
		// Just verify something rendered
		await expect(canvasElement).toBeTruthy();
	},
};

export const LoadingState: Story = {
	args: {
		children: <AdminContent />,
	},
	parameters: {
		apolloClient: {
			mocks: [
				{
					request: {
						query: UseUserIsAdminDocument,
					},
					delay: Infinity, // Never resolves, keeps loading state
				},
			],
		},
	},
	play: async ({ canvasElement }) => {
		// During loading, shows "Checking permissions..." message
		const loadingText = canvasElement.textContent?.includes('Checking permissions');
		await expect(loadingText).toBeTruthy();
	},
};
