import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { Terms } from './Terms.tsx';

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
		
		const acceptTermsCheckbox = canvas.getByRole('checkbox', { name: /I accept these Terms and Conditions/i });
		await expect(acceptTermsCheckbox).toBeInTheDocument();
		
		const submitButton = canvas.getByRole('button', { name: /Save and Continue/i });
		await expect(submitButton).toBeInTheDocument();
	},
};

export const WithoutNotifications: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const checkboxes = canvas.getAllByRole('checkbox');
		
		if (checkboxes[1]) {
			await userEvent.click(checkboxes[1]);
		}
		
		if (checkboxes[2]) {
			await userEvent.click(checkboxes[2]);
		}
	},
};

export const AcceptTermsAndSubmit: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const acceptTermsCheckbox = canvas.getByRole('checkbox', { name: /I accept these Terms and Conditions/i });
		await userEvent.click(acceptTermsCheckbox);
		
		const submitButton = canvas.getByRole('button', { name: /Save and Continue/i });
		await userEvent.click(submitButton);
	},
};

export const ValidationWithoutAcceptingTerms: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const submitButton = canvas.getByRole('button', { name: /Save and Continue/i });
		await userEvent.click(submitButton);
	},
};
