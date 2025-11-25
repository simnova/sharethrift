import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { Payment } from './Payment.tsx';
import { expect, within } from '@storybook/test';

const meta: Meta<typeof Payment> = {
	title: 'Pages/Signup/Payment',
	component: Payment,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		(Story) => (
			<BrowserRouter>
				<Story />
			</BrowserRouter>
		),
	],
};

export default meta;
type Story = StoryObj<typeof Payment>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('heading')).toBeInTheDocument();
	},
};

export const WithPrefilledData: Story = {};
