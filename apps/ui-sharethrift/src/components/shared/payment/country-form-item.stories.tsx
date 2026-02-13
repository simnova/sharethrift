import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Form } from 'antd';
import { countriesMockData } from '../../layouts/signup/components/countries-mock-data.ts';
import { CountryFormItem } from './country-form-item.tsx';

const meta: Meta<typeof CountryFormItem> = {
	title: 'Components/Shared/Payment/CountryFormItem',
	component: CountryFormItem,
	parameters: {
		layout: 'padded',
	},
	decorators: [
		(Story) => (
			<Form
				style={{ width: '100%', maxWidth: 400, padding: 20 }}
				initialValues={{
					country: '',
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
		fieldPath: 'country',
		countries: countriesMockData,
		onCountryChange: (value: string) => {
			console.log('Country changed to:', value);
		},
	},
};

export const WithUSSelected: Story = {
	args: {
		fieldPath: 'country',
		countries: countriesMockData,
		onCountryChange: (value: string) => {
			console.log('Country changed to:', value);
		},
	},
	decorators: [
		(Story) => (
			<Form
				style={{ width: '100%', maxWidth: 400, padding: 20 }}
				initialValues={{
					country: 'US',
				}}
			>
				<Story />
			</Form>
		),
	],
};

export const WithCanadaSelected: Story = {
	args: {
		fieldPath: 'country',
		countries: countriesMockData,
		onCountryChange: (value: string) => {
			console.log('Country changed to:', value);
		},
	},
	decorators: [
		(Story) => (
			<Form
				style={{ width: '100%', maxWidth: 400, padding: 20 }}
				initialValues={{
					country: 'CA',
				}}
			>
				<Story />
			</Form>
		),
	],
};

export const Interactive: Story = {
	render: () => {
		const [selectedCountry, setSelectedCountry] = useState('');

		return (
			<Form style={{ width: '100%', maxWidth: 400, padding: 20 }}>
				<CountryFormItem
					fieldPath="country"
					countries={countriesMockData}
					onCountryChange={(value) => {
						setSelectedCountry(value);
						console.log('Country changed to:', value);
					}}
				/>
				{selectedCountry && (
					<div style={{ marginTop: 16 }}>
						<strong>Selected Country:</strong> {selectedCountry}
					</div>
				)}
			</Form>
		);
	},
};
