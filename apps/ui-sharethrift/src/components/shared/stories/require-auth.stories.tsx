import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { MockAuthWrapper } from '../../../test-utils/storybook-decorators.tsx';
import { RequireAuth } from '../require-auth.tsx';

const meta: Meta<typeof RequireAuth> = {
	title: 'Shared/RequireAuth',
	component: RequireAuth,
	parameters: {
		layout: 'centered',
	},
	decorators: [
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
type Story = StoryObj<typeof RequireAuth>;

const ProtectedContent = () => (
	<div style={{ padding: '20px', background: '#e8f5e9' }}>
		<h2>Protected Content</h2>
		<p>This content is only visible to authenticated users.</p>
	</div>
);

export const WithAuthentication: Story = {
	args: {
		children: <ProtectedContent />,
	},
	play: async ({ canvasElement }) => {
		// The component will either show protected content or redirect/loading state
		// MockAuthWrapper provides isAuthenticated: true, so content should render
		const heading = canvasElement.querySelector('h2');
		await expect(heading).toBeTruthy();
	},
};

export const WithForceLogin: Story = {
	args: {
		children: <ProtectedContent />,
		forceLogin: true,
	},
	play: async ({ canvasElement }) => {
		// When forceLogin is true, component will trigger signin redirect
		// MockAuthWrapper provides isAuthenticated: true, so content should render
		const heading = canvasElement.querySelector('h2');
		await expect(heading).toBeTruthy();
	},
};

export const WithCustomRedirect: Story = {
	args: {
		children: <ProtectedContent />,
		redirectPath: '/custom-login',
	},
	play: async ({ canvasElement }) => {
		// Component uses custom redirect path when provided
		// MockAuthWrapper provides isAuthenticated: true, so content should render
		const heading = canvasElement.querySelector('h2');
		await expect(heading).toBeTruthy();
	},
};
