import type { FC } from 'react';
import { Typography, Form, Checkbox } from 'antd';
import { PaymentForm } from '../../../shared/payment/payment-form';
import type { Country } from '../../../shared/payment/country-type';
import type {
	PaymentContainerAccountPlansFieldsFragment,
	ProcessPaymentInput,
} from '../../../../generated';

const { Title, Text } = Typography;

interface PaymentProps {
	cyberSourcePublicKey: string;
	countries: Country[];
	onSubmitPayment: (paymentDetails: ProcessPaymentInput) => void;
	selectedAccountPlan: PaymentContainerAccountPlansFieldsFragment;
}
export const Payment: FC<PaymentProps> = (props) => {
	const additionalPaymentContent = (
		<>
			<Title
				level={3}
				style={{ color: 'var(--color-message-text)', marginBottom: '16px' }}
			>
				Order Confirmation
			</Title>

			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '16px',
				}}
			>
				<Text style={{ color: 'var(--color-message-text)', fontSize: '16px' }}>
					{props.selectedAccountPlan.description}
				</Text>
				<Text
					style={{
						color: 'var(--color-message-text)',
						fontSize: '16px',
						fontWeight: 600,
					}}
				>
					${props.selectedAccountPlan.billingAmount}/
					{props.selectedAccountPlan.billingPeriodUnit}
				</Text>
			</div>
			<Form.Item
				name="acceptAgreement"
				valuePropName="checked"
				rules={[
					{
						required: true,
						message: 'You must accept the agreement to continue',
						transform: (value) => value || undefined,
						type: 'boolean',
					},
				]}
				style={{ marginBottom: '24px' }}
			>
				<Checkbox style={{ color: 'var(--color-message-text)' }}>
					I understand this amount will be charged once my identity or business
					is verified and the account goes live.
				</Checkbox>
			</Form.Item>
		</>
	);
	return (
		<PaymentForm
			cyberSourcePublicKey={props.cyberSourcePublicKey}
			countries={props.countries}
			onSubmitPayment={props.onSubmitPayment}
			additionalContent={additionalPaymentContent}
			paymentAmount={props.selectedAccountPlan.billingAmount}
			currency={props.selectedAccountPlan.currency}
		/>
	);
};
