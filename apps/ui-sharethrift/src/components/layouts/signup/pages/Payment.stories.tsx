import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent } from 'storybook/test';
import { BrowserRouter } from 'react-router-dom';
import { Payment } from './Payment.tsx';

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
		
		const cardInput = canvas.getByLabelText('Card Number');
		await expect(cardInput).toBeInTheDocument();
		
		const saveButton = canvas.getByRole('button', { name: /Save Changes/i });
		await expect(saveButton).toBeInTheDocument();
		
		const submitButton = canvas.getByRole('button', { name: /Save and Continue/i });
		await expect(submitButton).toBeDisabled();
	},
};

export const WithPrefilledData: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const cardInput = canvas.getByLabelText('Card Number');
		await userEvent.type(cardInput, '4111111111111111');
		
		const expInput = canvas.getByLabelText('Expiration Date');
		await userEvent.type(expInput, '1225');
		
		const cvcInput = canvas.getByLabelText('Security Code');
		await userEvent.type(cvcInput, '123');
		
		const firstNameInputs = canvas.getAllByPlaceholderText('John');
		if (firstNameInputs[0]) await userEvent.type(firstNameInputs[0], 'John');

		const lastNameInputs = canvas.getAllByPlaceholderText('Doe');
		if (lastNameInputs[0]) await userEvent.type(lastNameInputs[0], 'Doe');
	},
};

export const ClickSaveChanges: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const saveButton = canvas.getByRole('button', { name: /Save Changes/i });
		await userEvent.click(saveButton);
		
		await expect(saveButton).toBeInTheDocument();
	},
};

export const FillBillingFields: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		const cardInput = canvas.getByLabelText('Card Number');
		await userEvent.type(cardInput, '4111111111111111');
		
		const expInput = canvas.getByLabelText('Expiration Date');
		await userEvent.type(expInput, '1225');
		
		const cvcInput = canvas.getByLabelText('Security Code');
		await userEvent.type(cvcInput, '123');
		
		const firstNameInputs = canvas.getAllByPlaceholderText('John');
		if (firstNameInputs[0]) await userEvent.type(firstNameInputs[0], 'John');
		const lastNameInputs = canvas.getAllByPlaceholderText('Doe');
		if (lastNameInputs[0]) await userEvent.type(lastNameInputs[0], 'Doe');
		
		const emailInput = canvas.getByPlaceholderText('johndoe@gmail.com');
		await userEvent.type(emailInput, 'test@example.com');
		
		const phoneInput = canvas.getByPlaceholderText('(302) 766-3711');
		await userEvent.type(phoneInput, '3027663711');
		
		const address1Input = canvas.getByPlaceholderText('Address Line 1');
		await userEvent.type(address1Input, '123 Main St');
		
		const cityInput = canvas.getByPlaceholderText('City');
		await userEvent.type(cityInput, 'Philadelphia');
		const stateInput = canvas.getByPlaceholderText('State');
		await userEvent.type(stateInput, 'PA');
		const countryInput = canvas.getByPlaceholderText('Country');
		await userEvent.type(countryInput, 'USA');

		const submitButton = canvas.getByRole('button', { name: /Save and Continue/i });
		await expect(submitButton).not.toBeDisabled();
	},
};

export const ValidFormSubmit: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		
		await userEvent.type(canvas.getByLabelText('Card Number'), '4111111111111111');
		await userEvent.type(canvas.getByLabelText('Expiration Date'), '1225');
		await userEvent.type(canvas.getByLabelText('Security Code'), '123');
		
		const firstNameInputs = canvas.getAllByPlaceholderText('John');
		if (firstNameInputs[0]) await userEvent.type(firstNameInputs[0], 'John');
		const lastNameInputs = canvas.getAllByPlaceholderText('Doe');
		if (lastNameInputs[0]) await userEvent.type(lastNameInputs[0], 'Doe');

		await userEvent.type(canvas.getByPlaceholderText('johndoe@gmail.com'), 'test@example.com');
		await userEvent.type(canvas.getByPlaceholderText('(302) 766-3711'), '3027663711');
		await userEvent.type(canvas.getByPlaceholderText('Address Line 1'), '123 Main St');
		await userEvent.type(canvas.getByPlaceholderText('City'), 'Philadelphia');
		await userEvent.type(canvas.getByPlaceholderText('State'), 'PA');
		await userEvent.type(canvas.getByPlaceholderText('Country'), 'USA');
		
		const checkbox = canvas.getByRole('checkbox');
		await userEvent.click(checkbox);

		const submitButton = canvas.getByRole('button', { name: /Save and Continue/i });
		await userEvent.click(submitButton);
	},
};
