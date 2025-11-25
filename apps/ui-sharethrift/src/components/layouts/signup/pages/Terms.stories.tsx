import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { Terms } from './Terms.tsx';
import { expect, within } from 'storybook/test';

const meta: Meta<typeof Terms> = {
	title: 'Pages/Signup/Terms',
	component: Terms,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		(Story: React.FC) => (
			<MemoryRouter>
				<Story />
			</MemoryRouter>
		),
	],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('heading')).toBeInTheDocument();
	},
};

export const WithoutNotifications: Story = {};
