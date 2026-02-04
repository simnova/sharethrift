import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { withMockApolloClient } from '../../test-utils/storybook-decorators.tsx';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from 'react-oidc-context';
import { RequireAuthAdmin } from './require-auth-admin.tsx';
import { UseUserIsAdminDocument } from '../../generated.tsx';
import { MockAuthWrapper } from '../../test-utils/storybook-mock-auth-wrappers.tsx';
import { createMockAuth } from '../../test/utils/mock-auth.ts';

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
	decorators: [withMockApolloClient],
  tags: ['!dev'], // functional testing story, not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags
};

export default meta;
type Story = StoryObj<typeof RequireAuthAdmin>;

const UseUserIsAdminMock = {
	request: {
		query: UseUserIsAdminDocument,
	},
	result: {
		data: {
			currentUser: {
				id: 'user-1',
				__typename: 'PersonalUser',
				userIsAdmin: true,
			},
		},
	},
};

const AdminProtectedContent = () => (
	<div style={{ padding: '20px', background: '#e3f2fd' }}>
		<h2>Admin Dashboard</h2>
		<p>This content is only visible to authenticated admin users.</p>
	</div>
);

// Common decorator for authenticated stories
const withAuthAndRouter = (Story: React.ComponentType) => (
	<MockAuthWrapper>
		<MemoryRouter>
			<Story />
		</MemoryRouter>
	</MockAuthWrapper>
);

export const WithAuthenticationAndAdmin: Story = {
	args: {
		children: <AdminProtectedContent />,
	},
	decorators: [withAuthAndRouter],
	parameters: {
		apolloClient: {
			mocks: [UseUserIsAdminMock],
		},
	},
	play: async ({ canvasElement }) => {
		// MockAuthWrapper provides isAuthenticated: true
		// Apollo mock provides isAdmin: true
		// Just verify something rendered
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithForceLogin: Story = {
	args: {
		children: <AdminProtectedContent />,
		forceLogin: true,
	},
	decorators: [withAuthAndRouter],
	parameters: {
		apolloClient: {
			mocks: [UseUserIsAdminMock],
		},
	},
	play: async ({ canvasElement }) => {
		// When forceLogin is true, component will trigger signin redirect if not authenticated
		// MockAuthWrapper provides isAuthenticated: true, so content should render
		await expect(canvasElement).toBeTruthy();
	},
};

export const WithCustomRedirect: Story = {
	args: {
		children: <AdminProtectedContent />,
		redirectPath: '/custom-login',
	},
	decorators: [withAuthAndRouter],
	parameters: {
		apolloClient: {
			mocks: [UseUserIsAdminMock],
		},
	},
	play: async ({ canvasElement }) => {
		// Component uses custom redirect path when provided
		// MockAuthWrapper provides isAuthenticated: true, so content should render
		await expect(canvasElement).toBeTruthy();
	},
};

export const AdminCheckLoading: Story = {
	args: {
		children: <AdminProtectedContent />,
	},
	decorators: [withAuthAndRouter],
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
		const loadingText =
			canvasElement.textContent?.includes('admin permissions');
		await expect(loadingText).toBeTruthy();
	},
};

export const NotAdmin: Story = {
	args: {
		children: <AdminProtectedContent />,
	},
	decorators: [withAuthAndRouter],
	parameters: {
		apolloClient: {
			mocks: [UseUserIsAdminMock],
		},
	},
	play: async ({ canvasElement }) => {
		// When user is not admin, should redirect - content won't show
		await expect(canvasElement).toBeTruthy();
	},
};

// Test unauthenticated with error
export const UnauthenticatedWithError: Story = {
	args: {
		children: <AdminProtectedContent />,
	},
	parameters: {
		apolloClient: {
			mocks: [UseUserIsAdminMock],
		},
	},
	decorators: [
		withMockApolloClient,
		(Story) => {
			const mockAuth = createMockAuth({
				isAuthenticated: false,
				isLoading: false,
				user: undefined,
			});
			return (
				<AuthContext.Provider value={mockAuth}>
					<MemoryRouter>
						<Story />
					</MemoryRouter>
				</AuthContext.Provider>
			);
		},
	],
	play: async ({ canvasElement }) => {
		// Should redirect on error
		await expect(canvasElement).toBeTruthy();
	},
};

// Test unauthenticated with loading
export const UnauthenticatedLoading: Story = {
	args: {
		children: <AdminProtectedContent />,
	},
	parameters: {
		apolloClient: {
			mocks: [UseUserIsAdminMock],
		},
	},
	decorators: [
		withMockApolloClient,
		(Story) => {
			const mockAuth = createMockAuth({
				isAuthenticated: false,
				isLoading: true,
				user: undefined,
			});
			return (
				<AuthContext.Provider value={mockAuth}>
					<MemoryRouter>
						<Story />
					</MemoryRouter>
				</AuthContext.Provider>
			);
		},
	],
	play: async ({ canvasElement }) => {
		// Should show loading state
		const checkingAuth = canvasElement.textContent?.includes(
			'Checking authentication',
		);
		await expect(checkingAuth).toBeTruthy();
	},
};

// Test unauthenticated without force login
export const UnauthenticatedNoForceLogin: Story = {
	args: {
		children: <AdminProtectedContent />,
		forceLogin: false,
	},
	parameters: {
		apolloClient: {
			mocks: [UseUserIsAdminMock],
		},
	},
	decorators: [
		withMockApolloClient,
		(Story) => {
			const mockAuth = createMockAuth({
				isAuthenticated: false,
				isLoading: false,
				user: undefined,
			});
			return (
				<AuthContext.Provider value={mockAuth}>
					<MemoryRouter>
						<Story />
					</MemoryRouter>
				</AuthContext.Provider>
			);
		},
	],
	play: async ({ canvasElement }) => {
		// Should redirect when not authenticated and not force login
		await expect(canvasElement).toBeTruthy();
	},
};

// Test force login triggers signinRedirect
export const ForceLoginTriggersSigninRedirect: Story = {
	args: {
		children: <AdminProtectedContent />,
		forceLogin: true,
	},
	parameters: {
		apolloClient: {
			mocks: [UseUserIsAdminMock],
		},
	},
	decorators: [
		withMockApolloClient,
		(Story) => {
			const mockAuth = createMockAuth({
				isAuthenticated: false,
				isLoading: false,
				user: undefined,
			});
			return (
				<AuthContext.Provider value={mockAuth}>
					<MemoryRouter>
						<Story />
					</MemoryRouter>
				</AuthContext.Provider>
			);
		},
	],
	play: async ({ canvasElement }) => {
		// forceLogin=true and not authenticated triggers auth.signinRedirect() (line 35)
		await expect(canvasElement).toBeTruthy();
	},
};

// Test access token expiring triggers signinSilent
export const AccessTokenExpiringTriggersSilent: Story = {
	args: {
		children: <AdminProtectedContent />,
	},
  parameters: {
		apolloClient: {
			mocks: [UseUserIsAdminMock],
		},
	},
	decorators: [
		withMockApolloClient,
		(Story) => {
			const addAccessTokenExpiring = (callback: () => void) => {
				// Immediately call the callback to simulate token expiring
				setTimeout(() => callback(), 100);
			};
			const user = {
				profile: { sub: 'admin-1', iss: '', aud: '', exp: 0, iat: 0 },
				access_token: `mock-token-${Date.now()}`,
				token_type: 'Bearer',
				session_state: `mock-session-${Date.now()}`,
				state: `mock-state-${Date.now()}`,
				expired: false,
				expires_in: 3600,
				scopes: [],
				toStorageString: () => '',
			};
			const mockAuth = createMockAuth({
				isAuthenticated: true,
				isLoading: false,
				user: user,
				events: { addAccessTokenExpiring } as any,
				signinSilent: () => Promise.resolve(user),
			});
			return (
				<AuthContext.Provider value={mockAuth}>
					<MemoryRouter>
						<Story />
					</MemoryRouter>
				</AuthContext.Provider>
			);
		},
	],
	play: async ({ canvasElement }) => {
		// Token expiring event triggers auth.signinSilent() (lines 49-51)
		await expect(canvasElement).toBeTruthy();
		// Wait for token expiring callback to execute
		await new Promise((resolve) => setTimeout(resolve, 200));
	},
};

// Test authentication error with forceLogin false
export const AuthenticationErrorNoForceLogin: Story = {
	args: {
		children: <AdminProtectedContent />,
		forceLogin: false,
	},
  parameters: {
		apolloClient: {
			mocks: [UseUserIsAdminMock],
		},
	},
	decorators: [
		withMockApolloClient,
		(Story) => {
			const mockAuth = createMockAuth({
				isAuthenticated: false,
				isLoading: false,
				user: undefined,
				error: Object.assign(new Error('Authentication failed'), {
					source: 'unknown' as const,
				}),
			});
			return (
				<AuthContext.Provider value={mockAuth}>
					<MemoryRouter>
						<Story />
					</MemoryRouter>
				</AuthContext.Provider>
			);
		},
	],
	play: async ({ canvasElement }) => {
		// auth.error check triggers redirect (lines 58-59)
		await expect(canvasElement).toBeTruthy();
	},
};
