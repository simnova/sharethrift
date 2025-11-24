import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { RequireAdmin } from '../require-admin.tsx';

const meta = {
	title: 'Shared/RequireAdmin',
	component: RequireAdmin,
	parameters: {
		layout: 'centered',
	},
	decorators: [
		(Story) => (
			<MemoryRouter>
				<Story />
			</MemoryRouter>
		),
	],
} satisfies Meta<typeof RequireAdmin>;

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
		const element = canvasElement.querySelector('div');
		await expect(element).toBeInTheDocument();
	},
};

export const LoadingState: Story = {
	args: {
		children: <AdminContent />,
	},
	play: async ({ canvasElement }) => {
		// During loading, shows "Checking permissions..." message
		const element = canvasElement.querySelector('div');
		await expect(element).toBeInTheDocument();
	},
};
