import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { ProfileSetup } from './ProfileSetup.tsx';
const meta: Meta<typeof ProfileSetup> = {
	title: 'Pages/Signup/ProfileSetup',
	component: ProfileSetup,
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
		
		const firstNameInput = canvas.getByPlaceholderText('Your First Name');
		await expect(firstNameInput).toBeInTheDocument();
		
		const lastNameInput = canvas.getByPlaceholderText('Your Last Name');
		await expect(lastNameInput).toBeInTheDocument();
		
		const addressInput = canvas.getByPlaceholderText('Address Line 1');
		await expect(addressInput).toBeInTheDocument();
		
		const submitButton = canvas.getByRole('button', { name: /Save and Continue/i });
		await expect(submitButton).toBeInTheDocument();
	},
};

export const WithAvatar: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const uploadButton = canvas.getByRole('button', { name: /Choose Image/i });
		await expect(uploadButton).toBeInTheDocument();
	},
};

export const WithFilledForm: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const firstNameInput = canvas.getByPlaceholderText('Your First Name');
		await userEvent.type(firstNameInput, 'John');
		
		const lastNameInput = canvas.getByPlaceholderText('Your Last Name');
		await userEvent.type(lastNameInput, 'Doe');
		
		const addressInput = canvas.getByPlaceholderText('Address Line 1');
		await userEvent.type(addressInput, '123 Main St');
		
		const cityInput = canvas.getByPlaceholderText('City');
		await userEvent.type(cityInput, 'Philadelphia');
		
		const stateInput = canvas.getByPlaceholderText('State');
		await userEvent.type(stateInput, 'PA');
		
		const countryInput = canvas.getByPlaceholderText('Country');
		await userEvent.type(countryInput, 'USA');
		
		await expect(firstNameInput).toHaveValue('John');
	},
};

export const SubmitForm: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		await userEvent.type(canvas.getByPlaceholderText('Address Line 1'), '123 Main St');
		await userEvent.type(canvas.getByPlaceholderText('City'), 'Philadelphia');
		await userEvent.type(canvas.getByPlaceholderText('State'), 'PA');
		await userEvent.type(canvas.getByPlaceholderText('Country'), 'USA');
		
		const submitButton = canvas.getByRole('button', { name: /Save and Continue/i });
		await userEvent.click(submitButton);
	},
};
