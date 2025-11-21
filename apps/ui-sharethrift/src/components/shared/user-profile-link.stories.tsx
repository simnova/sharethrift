import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { UserProfileLink } from './user-profile-link.tsx';

const meta: Meta<typeof UserProfileLink> = {
	title: 'Shared/UserProfileLink',
	component: UserProfileLink,
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
		displayName: {
			control: 'text',
			description: 'The display name to show as the link text',
		},
		className: {
			control: 'text',
			description: 'Additional CSS class names',
		},
		style: {
			control: 'object',
			description: 'Custom inline styles',
		},
	},
};

export default meta;
type Story = StoryObj<typeof UserProfileLink>;

export const Default: Story = {
	args: {
		userId: '507f1f77bcf86cd799439011',
		displayName: 'John Doe',
	},
};

export const WithCustomStyle: Story = {
	args: {
		userId: '507f1f77bcf86cd799439011',
		displayName: 'Jane Smith',
		style: {
			fontSize: '18px',
			fontWeight: 'bold',
			color: '#ff0000',
		},
	},
};

export const InContext: Story = {
	render: () => (
		<div style={{ padding: '20px' }}>
			<p>
				This listing is shared by{' '}
				<UserProfileLink userId="507f1f77bcf86cd799439011" displayName="Alice Johnson" />{' '}
				and was requested by{' '}
				<UserProfileLink userId="507f1f77bcf86cd799439012" displayName="Bob Williams" />.
			</p>
		</div>
	),
};
