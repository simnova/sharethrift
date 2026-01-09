import type { Meta, StoryObj } from '@storybook/react';
import { PaymentTokenFormItems } from './payment-token-form-items.tsx';
import { Form } from 'antd';
import { useState } from 'react';

const meta: Meta<typeof PaymentTokenFormItems> = {
	title: 'Components/Shared/Payment/PaymentTokenFormItems',
	component: PaymentTokenFormItems,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Component for handling payment token creation with CyberSource Flex Microform integration. Provides card number and security code input fields.',
			},
		},
	},
	decorators: [
		(Story) => (
			<Form
				style={{ width: '100%', maxWidth: 500, padding: 20 }}
				initialValues={{
					cardNumber: '',
					securityCode: '',
					expiration: null,
				}}
			>
				<Story />
			</Form>
		),
	],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock public key for testing
const MOCK_PUBLIC_KEY = 'mock-cybersource-key-123';

export const Default: Story = {
	args: {
		cyberSourcePublicKey: MOCK_PUBLIC_KEY,
		onMicroformCreated: (microform) => {
			console.log('Microform created:', microform);
		},
		onCardNumberChange: (isEmpty) => {
			console.log('Card number changed, isEmpty:', isEmpty);
		},
		onSecurityCodeChange: (isEmpty) => {
			console.log('Security code changed, isEmpty:', isEmpty);
		},
	},
};

export const WithCallbacks: Story = {
	render: () => {
		const [cardNumberEmpty, setCardNumberEmpty] = useState(true);
		const [securityCodeEmpty, setSecurityCodeEmpty] = useState(true);

		return (
			<div>
				<Form
					style={{ width: '100%', maxWidth: 500, padding: 20 }}
					initialValues={{
						cardNumber: '',
						securityCode: '',
						expiration: null,
					}}
				>
					<PaymentTokenFormItems
						cyberSourcePublicKey={MOCK_PUBLIC_KEY}
						onMicroformCreated={(microform) => {
							console.log('Microform created:', microform);
						}}
						onCardNumberChange={(isEmpty) => {
							setCardNumberEmpty(isEmpty);
						}}
						onSecurityCodeChange={(isEmpty) => {
							setSecurityCodeEmpty(isEmpty);
						}}
					/>
				</Form>
				<div style={{ marginTop: 16, padding: 10, backgroundColor: '#f5f5f5' }}>
					<h4>Field Status:</h4>
					<p>Card Number Empty: {cardNumberEmpty ? 'Yes' : 'No'}</p>
					<p>Security Code Empty: {securityCodeEmpty ? 'Yes' : 'No'}</p>
				</div>
			</div>
		);
	},
};

export const WithEmptyKey: Story = {
	args: {
		cyberSourcePublicKey: '',
		onMicroformCreated: (microform) => {
			console.log('Microform created:', microform);
		},
		onCardNumberChange: (isEmpty) => {
			console.log('Card number changed, isEmpty:', isEmpty);
		},
		onSecurityCodeChange: (isEmpty) => {
			console.log('Security code changed, isEmpty:', isEmpty);
		},
	},
};

export const WithDifferentKey: Story = {
	args: {
		cyberSourcePublicKey: 'alternative-key-456',
		onMicroformCreated: (microform) => {
			console.log('Microform created with alternative key:', microform);
		},
		onCardNumberChange: (isEmpty) => {
			console.log('Card number changed, isEmpty:', isEmpty);
		},
		onSecurityCodeChange: (isEmpty) => {
			console.log('Security code changed, isEmpty:', isEmpty);
		},
	},
};
