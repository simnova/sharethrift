import type { Meta, StoryObj } from '@storybook/react';
import { PaymentForm } from './payment-form.tsx';
import { countriesMockData } from '../../layouts/signup/components/countries-mock-data.ts';
import type { ProcessPaymentInput } from '../../../generated.tsx';
import { Typography } from 'antd';
import { useState } from 'react';

const { Text } = Typography;

const meta: Meta<typeof PaymentForm> = {
	title: 'Shared/Payment/PaymentForm',
	component: PaymentForm,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Complete payment form with card details and billing address. Integrates CyberSource Flex Microform for secure payment processing.',
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockOnSubmitPayment = (paymentDetails: ProcessPaymentInput) => {
	console.log('Payment submitted:', paymentDetails);
	alert('Payment submitted! Check console for details.');
};

export const Default: Story = {
	args: {
		cyberSourcePublicKey: 'mock-cybersource-key-123',
		countries: countriesMockData,
		onSubmitPayment: mockOnSubmitPayment,
		paymentAmount: 9.99,
		currency: 'USD',
	},
};

export const WithHigherAmount: Story = {
	args: {
		cyberSourcePublicKey: 'mock-cybersource-key-123',
		countries: countriesMockData,
		onSubmitPayment: mockOnSubmitPayment,
		paymentAmount: 99.99,
		currency: 'USD',
	},
};

export const WithCustomCurrency: Story = {
	args: {
		cyberSourcePublicKey: 'mock-cybersource-key-123',
		countries: countriesMockData,
		onSubmitPayment: mockOnSubmitPayment,
		paymentAmount: 49.99,
		currency: 'CAD',
	},
};

export const WithAdditionalContent: Story = {
	args: {
		cyberSourcePublicKey: 'mock-cybersource-key-123',
		countries: countriesMockData,
		onSubmitPayment: mockOnSubmitPayment,
		paymentAmount: 29.99,
		currency: 'USD',
		additionalContent: (
			<div
				style={{
					padding: 16,
					backgroundColor: '#f0f8ff',
					borderRadius: 4,
					marginTop: 16,
				}}
			>
				<Text strong>Special Offer!</Text>
				<p>Get 10% off your first month when you sign up today.</p>
			</div>
		),
	},
};

export const WithLargeSubscription: Story = {
	args: {
		cyberSourcePublicKey: 'mock-cybersource-key-123',
		countries: countriesMockData,
		onSubmitPayment: mockOnSubmitPayment,
		paymentAmount: 299.99,
		currency: 'USD',
		additionalContent: (
			<div
				style={{
					padding: 16,
					backgroundColor: '#fff3cd',
					borderRadius: 4,
					marginTop: 16,
				}}
			>
				<Text strong>Annual Subscription</Text>
				<p>
					You will be charged $299.99 annually. Cancel anytime before renewal.
				</p>
			</div>
		),
	},
};

export const WithLimitedCountries: Story = {
	args: {
		cyberSourcePublicKey: 'mock-cybersource-key-123',
		countries: countriesMockData.filter(
			(c) => c.countryCode === 'US' || c.countryCode === 'CA',
		),
		onSubmitPayment: mockOnSubmitPayment,
		paymentAmount: 19.99,
		currency: 'USD',
	},
};

export const WithEmptyKey: Story = {
	args: {
		cyberSourcePublicKey: '',
		countries: countriesMockData,
		onSubmitPayment: mockOnSubmitPayment,
		paymentAmount: 9.99,
		currency: 'USD',
	},
};

// Test the validation error path when form is incomplete
export const FormValidationErrors: Story = {
	render: () => {
		const [submitCalled, setSubmitCalled] = useState(false);
		const handleSubmit = (paymentDetails: ProcessPaymentInput) => {
			setSubmitCalled(true);
			console.log('Payment submitted:', paymentDetails);
		};

		return (
			<div>
				<PaymentForm
					cyberSourcePublicKey="mock-cybersource-key-123"
					countries={countriesMockData}
					onSubmitPayment={handleSubmit}
					paymentAmount={9.99}
					currency="USD"
				/>
				{submitCalled && <div>Form submitted successfully!</div>}
			</div>
		);
	},
};
