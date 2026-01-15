import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { AuthLanding } from './auth-landing.tsx';

const meta: Meta<typeof AuthLanding> = {
	title: 'Shared/AuthLanding',
	component: AuthLanding,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		(Story) => (
			<MemoryRouter>
				<Story />
			</MemoryRouter>
		),
	],
};

export default meta;
type Story = StoryObj<typeof AuthLanding>;

export const Default: Story = {
	play: ({ canvasElement }) => {
		// The AuthLanding component renders a Navigate component
		// We can only verify that the component doesn't throw an error
		expect(canvasElement).toBeTruthy();
	},
};
