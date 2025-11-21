import type { Meta, StoryObj } from '@storybook/react';
import { Navigation } from '@sthrift/ui-components';
import { expect, within } from 'storybook/test';

const meta: Meta<typeof Navigation> = {
	title: "Components/Navigation",
	component: Navigation,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		isAuthenticated: {
			control: 'boolean',
			description: 'Whether the user is authenticated',
		},
		selectedKey: {
			control: 'select',
			options: ['home', 'my-listings', 'my-reservations', 'messages', 'account'],
			description: 'The currently selected navigation item',
		},
		onNavigate: {
			action: 'navigate',
			description: 'Callback when navigation item is clicked',
		},
		onLogout: {
			action: 'logout',
			description: 'Callback when logout is clicked',
		},
	},
	decorators: [
		(Story) => (
			<div style={{ 
				height: '100vh', 
				width: '100vw',
				display: 'flex',
				overflow: 'hidden'
			}}>
				<Story />
				<div style={{ 
					marginLeft: '240px',
					flex: 1,
					backgroundColor: '#f5f5f5',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					color: '#666',
					fontSize: '18px'
				}}>
				</div>
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof Navigation>;

export const Default: Story = {
	args: {
		isAuthenticated: true,
		selectedKey: 'home',
		onNavigate: (route: string) => console.log('Navigate to:', route),
		onLogout: () => console.log('Logout clicked'),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('navigation')).toBeInTheDocument();
	},
};