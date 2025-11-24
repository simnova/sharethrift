import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { withMockApolloClient, MockAuthWrapper } from '../../../test-utils/storybook-decorators.tsx';
import { MemoryRouter } from 'react-router-dom';
import { RequireAuthAdmin } from '../require-auth-admin.tsx';
import { UseUserIsAdminDocument } from '../../../generated.tsx';

const meta: Meta<typeof RequireAuthAdmin> = {
	title: 'Shared/RequireAuthAdmin',
	component: RequireAuthAdmin,
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
								__typename: 'PersonalUser',
								userIsAdmin: true,
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
type Story = StoryObj<typeof RequireAuthAdmin>;

const AdminProtectedContent = () => (
	<div style={{ padding: '20px', background: '#e3f2fd' }}>
		<h2>Admin Dashboard</h2>
		<p>This content is only visible to authenticated admin users.</p>
	</div>
);

export const WithAuthenticationAndAdmin: Story = {
	args: {
		children: <AdminProtectedContent />,
	},
	play: async ({ canvasElement }) => {
		// MockAuthWrapper provides isAuthenticated: true
		// Apollo mock provides isAdmin: true
		// Content should render
		const heading = canvasElement.querySelector('h2');
		await expect(heading).toBeTruthy();
	},
};

export const WithForceLogin: Story = {
	args: {
		children: <AdminProtectedContent />,
		forceLogin: true,
	},
	play: async ({ canvasElement }) => {
		// When forceLogin is true, component will trigger signin redirect if not authenticated
		// MockAuthWrapper provides isAuthenticated: true, so content should render
		const heading = canvasElement.querySelector('h2');
		await expect(heading).toBeTruthy();
	},
};

export const WithCustomRedirect: Story = {
	args: {
		children: <AdminProtectedContent />,
		redirectPath: '/custom-login',
	},
	play: async ({ canvasElement }) => {
		// Component uses custom redirect path when provided
		// MockAuthWrapper provides isAuthenticated: true, so content should render
		const heading = canvasElement.querySelector('h2');
		await expect(heading).toBeTruthy();
	},
};

export const AdminCheckLoading: Story = {
	args: {
		children: <AdminProtectedContent />,
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
		// During admin check loading, shows "Checking admin permissions..." message
		const loadingText = canvasElement.textContent?.includes('admin permissions');
		await expect(loadingText).toBeTruthy();
	},
};
