import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from 'react-oidc-context';
import { createMockAuth, createMockUser } from '../../test/utils/mock-auth.ts';
import { AuthRedirectAdmin } from './auth-redirect-admin.tsx';

const meta: Meta<typeof AuthRedirectAdmin> = {
	title: 'Shared/AuthRedirectAdmin',
	component: AuthRedirectAdmin,
	parameters: {
		layout: 'fullscreen',
	},
  tags: ['!dev'], // functional testing story, not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags
};

export default meta;
type Story = StoryObj<typeof AuthRedirectAdmin>;

// Authenticated state - covers the Navigate branch
export const Authenticated: Story = {
	decorators: [
		(Story) => {
			const mockAuth = createMockAuth({
				isAuthenticated: true,
				isLoading: false,
				user: createMockUser(),
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
	play: ({ canvasElement }) => {
		expect(canvasElement).toBeTruthy();
	},
};

// Loading state - covers the loading UI branch
export const Loading: Story = {
	decorators: [
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
	play: ({ canvasElement }) => {
		expect(canvasElement).toBeTruthy();
		expect(canvasElement.textContent).toContain('Redirecting to login');
	},
};
