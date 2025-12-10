import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, within } from 'storybook/test';
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
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		// Test that link is rendered
		const link = canvas.getByRole('link', { name: 'John Doe' });
		await expect(link).toBeInTheDocument();
		await expect(link).toHaveAttribute('href', '/user/507f1f77bcf86cd799439011');
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
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		// Test link is rendered and accessible
		const link = canvas.getByRole('link', { name: 'Jane Smith' });
		await expect(link).toBeInTheDocument();
		await expect(link).toHaveAttribute('href', '/user/507f1f77bcf86cd799439011');
		
		// Verify custom color is applied
		await expect(link).toHaveStyle({ color: 'rgb(255, 0, 0)' });
	},
};

export const WithoutUserId: Story = {
	args: {
		userId: '',
		displayName: 'Unknown User',
	},
	parameters: {
		docs: {
			description: {
				story: 'When no userId is provided, the component renders as plain text instead of a link.',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		// Test that plain text is rendered (not a link)
		await expect(canvas.getByText('Unknown User')).toBeInTheDocument();
		await expect(canvas.queryByRole('link')).not.toBeInTheDocument();
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
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		// Test both links are rendered
		const aliceLink = canvas.getByRole('link', { name: 'Alice Johnson' });
		const bobLink = canvas.getByRole('link', { name: 'Bob Williams' });
		
		await expect(aliceLink).toBeInTheDocument();
		await expect(aliceLink).toHaveAttribute('href', '/user/507f1f77bcf86cd799439011');
		
		await expect(bobLink).toBeInTheDocument();
		await expect(bobLink).toHaveAttribute('href', '/user/507f1f77bcf86cd799439012');
	},
};
