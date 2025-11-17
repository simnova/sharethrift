import type { Meta, StoryObj } from '@storybook/react';
import { Navigation } from './index.tsx';
import { useState } from 'react';

const meta: Meta<typeof Navigation> = {
	title: 'Molecules/Navigation',
	component: Navigation,
	parameters: {
		layout: 'fullscreen',
	},
};
export default meta;

type Story = StoryObj<typeof Navigation>;

export const LoggedOut: Story = {
	render: () => (
		<Navigation
			isAuthenticated={false}
			onNavigate={() => {
				/* intentionally empty for story */
			}}
		/>
	),
};

const LoggedInDemo = () => {
	const [isAuthenticated] = useState(false);
	return (
		<Navigation
			isAuthenticated={isAuthenticated}
			onNavigate={() => {
				/* intentionally empty for story */
			}}
		/>
	);
};

export const LoggedIn: Story = {
	render: () => <LoggedInDemo />,
};
