import type { Meta, StoryObj } from '@storybook/react';
import { BillingAddressFormItems } from './billing-address-form-items.tsx';
import { Form } from 'antd';
import { countriesMockData } from '../../layouts/signup/components/countries-mock-data.ts';

const meta: Meta<typeof BillingAddressFormItems> = {
	title: 'Components/Shared/Payment/BillingAddressFormItems',
	component: BillingAddressFormItems,
	parameters: {
		layout: 'padded',
	},
	decorators: [
		(Story) => (
			<Form
				style={{ width: '100%', maxWidth: 800, padding: 20 }}
				initialValues={{
					billingFirstName: '',
					billingLastName: '',
					billingEmail: '',
					billingCountry: '',
					billingAddress: '',
					billingCity: '',
					billingState: '',
					billingPostalCode: '',
				}}
			>
				<Story />
			</Form>
		),
	],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		countries: countriesMockData,
	},
};

export const WithUSSelected: Story = {
	args: {
		countries: countriesMockData,
	},
	decorators: [
		(Story) => (
			<Form
				style={{ width: '100%', maxWidth: 800, padding: 20 }}
				initialValues={{
					billingFirstName: 'John',
					billingLastName: 'Doe',
					billingEmail: 'john.doe@example.com',
					billingCountry: 'US',
					billingAddress: '123 Main St',
					billingCity: 'New York',
					billingState: 'NY',
					billingPostalCode: '10001',
				}}
			>
				<Story />
			</Form>
		),
	],
};

export const WithCanadaSelected: Story = {
	args: {
		countries: countriesMockData,
	},
	decorators: [
		(Story) => (
			<Form
				style={{ width: '100%', maxWidth: 800, padding: 20 }}
				initialValues={{
					billingFirstName: 'Jane',
					billingLastName: 'Smith',
					billingEmail: 'jane.smith@example.com',
					billingCountry: 'CA',
					billingAddress: '456 Maple Ave',
					billingCity: 'Toronto',
					billingState: 'ON',
					billingPostalCode: 'M5H 2N2',
				}}
			>
				<Story />
			</Form>
		),
	],
};

export const WithOtherCountry: Story = {
	args: {
		countries: countriesMockData,
	},
	decorators: [
		(Story) => (
			<Form
				style={{ width: '100%', maxWidth: 800, padding: 20 }}
				initialValues={{
					billingFirstName: 'Carlos',
					billingLastName: 'Garcia',
					billingEmail: 'carlos.garcia@example.com',
					billingCountry: 'ES',
					billingAddress: 'Calle Principal 123',
					billingCity: 'Madrid',
					billingState: '',
					billingPostalCode: '28001',
				}}
			>
				<Story />
			</Form>
		),
	],
};
