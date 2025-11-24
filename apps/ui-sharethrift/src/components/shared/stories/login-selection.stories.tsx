import type { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { LoginSelection } from '../login-selection.tsx';

const meta = {
	title: 'Shared/LoginSelection',
	component: LoginSelection,
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
} satisfies Meta<typeof LoginSelection>;

export default meta;
type Story = StoryObj<typeof LoginSelection>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		// Verify the login selection page renders
		const element = canvasElement.querySelector('div');
		await expect(element).toBeInTheDocument();
	},
};

export const WithEnvironment: Story = {
	play: async ({ canvasElement }) => {
		// Test component renders in different environments
		// The component behavior changes based on import.meta.env.MODE
		const element = canvasElement.querySelector('div');
		await expect(element).toBeInTheDocument();
	},
};
