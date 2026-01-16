import type { Meta, StoryObj } from '@storybook/react';
import { handleCountryChange } from './country-change-utils.ts';
import type { ZipcodeRule } from './billing-address-form-items.tsx';
import { Form } from 'antd';
import { useState } from 'react';

// Mock component to test the utility function
const CountryChangeTestComponent = () => {
	const [form] = Form.useForm();
	const [zipCodeRules, setZipCodeRules] = useState<ZipcodeRule[]>([
		{ required: true, message: 'Please enter the ZIP/Postal code' },
	]);
	const [selectedCountry, setSelectedCountry] = useState('');

	const handleChange = (countryCode: string) => {
		handleCountryChange(countryCode, form, setZipCodeRules, 'state');
		setSelectedCountry(countryCode);
	};

	return (
		<div style={{ padding: 20, maxWidth: 500 }}>
			<h3>Test Country Change Handler</h3>
			<div style={{ marginBottom: 16 }}>
				<button
					type="button"
					onClick={() => handleChange('US')}
					style={{ marginRight: 8, padding: '8px 16px' }}
				>
					Select US
				</button>
				<button
					type="button"
					onClick={() => handleChange('CA')}
					style={{ marginRight: 8, padding: '8px 16px' }}
				>
					Select Canada
				</button>
				<button
					type="button"
					onClick={() => handleChange('ES')}
					style={{ marginRight: 8, padding: '8px 16px' }}
				>
					Select Spain
				</button>
			</div>
			
			{selectedCountry && (
				<div style={{ marginTop: 16 }}>
					<h4>Selected Country: {selectedCountry}</h4>
					<h5>Zip Code Rules:</h5>
					<pre style={{ 
						backgroundColor: '#f5f5f5', 
						padding: 10, 
						borderRadius: 4,
						fontSize: 12
					}}>
						{JSON.stringify(zipCodeRules, null, 2)}
					</pre>
				</div>
			)}

			<Form form={form} style={{ marginTop: 20 }}>
				<Form.Item label="State" name="state">
					<input type="text" placeholder="State field (will be reset)" />
				</Form.Item>
			</Form>
		</div>
	);
};

const meta: Meta<typeof CountryChangeTestComponent> = {
	title: 'Shared/Payment/CountryChangeUtils',
	component: CountryChangeTestComponent,
	parameters: {
		layout: 'padded',
	},
  tags: ['!dev'], // not rendered in sidebar - https://storybook.js.org/docs/writing-stories/tags
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const USTestComponent = () => {
	const [form] = Form.useForm();
	const [zipCodeRules, setZipCodeRules] = useState<ZipcodeRule[]>([
		{ required: true, message: 'Please enter the ZIP/Postal code' },
	]);
	const [hasExecuted, setHasExecuted] = useState(false);

	// Execute once on mount
	if (!hasExecuted) {
		handleCountryChange('US', form, setZipCodeRules, 'state');
		setHasExecuted(true);
	}

	return (
		<div style={{ padding: 20, maxWidth: 500 }}>
			<h3>US Zip Code Rules</h3>
			<pre style={{ 
				backgroundColor: '#f5f5f5', 
				padding: 10, 
				borderRadius: 4,
				fontSize: 12
			}}>
				{JSON.stringify(zipCodeRules, null, 2)}
			</pre>
		</div>
	);
};

const CATestComponent = () => {
	const [form] = Form.useForm();
	const [zipCodeRules, setZipCodeRules] = useState<ZipcodeRule[]>([
		{ required: true, message: 'Please enter the ZIP/Postal code' },
	]);
	const [hasExecuted, setHasExecuted] = useState(false);

	// Execute once on mount
	if (!hasExecuted) {
		handleCountryChange('CA', form, setZipCodeRules, 'state');
		setHasExecuted(true);
	}

	return (
		<div style={{ padding: 20, maxWidth: 500 }}>
			<h3>Canadian Postal Code Rules</h3>
			<pre style={{ 
				backgroundColor: '#f5f5f5', 
				padding: 10, 
				borderRadius: 4,
				fontSize: 12
			}}>
				{JSON.stringify(zipCodeRules, null, 2)}
			</pre>
		</div>
	);
};

const DefaultTestComponent = () => {
	const [form] = Form.useForm();
	const [zipCodeRules, setZipCodeRules] = useState<ZipcodeRule[]>([
		{ required: true, message: 'Please enter the ZIP/Postal code' },
	]);
	const [hasExecuted, setHasExecuted] = useState(false);

	// Execute once on mount
	if (!hasExecuted) {
		handleCountryChange('UK', form, setZipCodeRules, 'state');
		setHasExecuted(true);
	}

	return (
		<div style={{ padding: 20, maxWidth: 500 }}>
			<h3>Default (Other Country) Rules</h3>
			<pre style={{ 
				backgroundColor: '#f5f5f5', 
				padding: 10, 
				borderRadius: 4,
				fontSize: 12
			}}>
				{JSON.stringify(zipCodeRules, null, 2)}
			</pre>
		</div>
	);
};

export const USZipCodeValidation: Story = {
	render: () => <USTestComponent />,
};

export const CanadianPostalCodeValidation: Story = {
	render: () => <CATestComponent />,
};

export const DefaultCountryValidation: Story = {
	render: () => <DefaultTestComponent />,
};
