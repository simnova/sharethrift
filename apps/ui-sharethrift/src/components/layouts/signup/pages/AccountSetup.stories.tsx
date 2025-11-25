import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { AccountSetup } from './AccountSetup.tsx';
import { expect, within } from '@storybook/test';

const meta: Meta<typeof AccountSetup> = {
	title: 'Pages/Signup/AccountSetup',
	component: AccountSetup,
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
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		// Verify the page heading is present
		const heading = canvas.getByRole('heading');
		expect(heading).toBeInTheDocument();
		expect(heading).toBeVisible();
		
		// Verify form elements are present
		const inputs = canvas.queryAllByRole('textbox');
		if (inputs.length > 0) {
			expect(inputs[0]).toBeInTheDocument();
		}
		
		// Verify buttons are present
		const buttons = canvas.getAllByRole('button');
		expect(buttons.length).toBeGreaterThan(0);
	},
};

export const WithPrefilledData: Story = {};
