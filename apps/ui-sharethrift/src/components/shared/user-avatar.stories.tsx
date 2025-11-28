import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { UserAvatar } from './user-avatar.tsx';

const meta: Meta<typeof UserAvatar> = {
	title: 'Shared/UserAvatar',
	component: UserAvatar,
	decorators: [
		(Story) => (
			<BrowserRouter>
				<Story />
			</BrowserRouter>
		),
	],
	tags: ['autodocs'],
	argTypes: {
		userId: {
			control: 'text',
			description: 'The ID of the user to link to',
		},
		userName: {
			control: 'text',
			description: 'The name of the user for accessibility and initial',
		},
		size: {
			control: 'number',
			description: 'Size of the avatar in pixels',
		},
		avatarUrl: {
			control: 'text',
			description: 'URL of the user avatar image (optional)',
		},
		shape: {
			control: 'select',
			options: ['circle', 'square'],
			description: 'Shape of the avatar',
		},
	},
};

export default meta;
type Story = StoryObj<typeof UserAvatar>;

export const Default: Story = {
	args: {
		userId: '507f1f77bcf86cd799439011',
		userName: 'John Doe',
		size: 48,
	},
};

export const Small: Story = {
	args: {
		userId: '507f1f77bcf86cd799439011',
		userName: 'Jane Smith',
		size: 32,
	},
};

export const Large: Story = {
	args: {
		userId: '507f1f77bcf86cd799439011',
		userName: 'Alice Johnson',
		size: 72,
	},
};

export const Square: Story = {
	args: {
		userId: '507f1f77bcf86cd799439011',
		userName: 'Bob Williams',
		size: 48,
		shape: 'square',
	},
};

export const WithoutUserId: Story = {
	args: {
		userId: '',
		userName: 'Unknown User',
		size: 48,
	},
	parameters: {
		docs: {
			description: {
				story: 'When no userId is provided, the avatar is rendered without a link (non-clickable).',
			},
		},
	},
};

export const InContext: Story = {
	render: () => (
		<div style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
			<UserAvatar userId="507f1f77bcf86cd799439011" userName="Alice Johnson" size={48} />
			<div>
				<h3 style={{ margin: 0 }}>Alice Johnson</h3>
				<p style={{ margin: 0, color: '#666' }}>Click the avatar to view profile</p>
			</div>
		</div>
	),
};

export const MultipleAvatars: Story = {
	render: () => (
		<div style={{ padding: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
			<UserAvatar userId="507f1f77bcf86cd799439011" userName="Alice Johnson" size={48} />
			<UserAvatar userId="507f1f77bcf86cd799439012" userName="Bob Smith" size={48} />
			<UserAvatar userId="507f1f77bcf86cd799439013" userName="Charlie Brown" size={48} />
			<UserAvatar userId="507f1f77bcf86cd799439014" userName="Diana Prince" size={48} />
		</div>
	),
};
