import { Button, Form, message, Typography } from 'antd';
import dayjs from 'dayjs';
import { useState, type FC } from 'react';
import {
	PaymentTokenFormItems,
	type TokenOptions,
} from './payment-token-form-items.tsx';
import { BillingAddressFormItems } from './billing-address-form-items.tsx';
import type { Country } from './country-type.ts';
import utc from 'dayjs/plugin/utc.js';
import type { ProcessPaymentInput } from '../../../generated.tsx';
import { useUserId } from '../user-context.tsx';

const { Title } = Typography;
dayjs.extend(utc);

interface PaymentFormProps {
	cyberSourcePublicKey: string;
	countries: Country[];
	onSubmitPayment: (paymentDetails: ProcessPaymentInput) => void;
	additionalContent?: React.JSX.Element;
	paymentAmount: number;
  currency: string;
}
export const PaymentForm: FC<PaymentFormProps> = (props) => {
	const userId = useUserId();
	const [form] = Form.useForm();
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [flexMicroform, setFlexMicroform] = useState<any>(null);

	const createToken = (tokenOption: TokenOptions) => {
		return new Promise((resolve, reject) => {
			if (flexMicroform === null) {
				message.error('Flex Microform is not loaded.');
				reject(new Error('Flex Microform is not loaded.'));
				return;
			}

			flexMicroform.createToken(
				tokenOption,
				(error: Error | null, token: string) => {
					if (error) {
						console.log('CREATE TOKEN ERROR', error);
						reject(error);
					} else {
						console.log('TOKEN CREATED', token);
						form.setFieldsValue({ paymentInstrumentToken: token });
						resolve(token);
					}
				},
			);
		});
	};

	const onSubmit = () => {
		form
			.validateFields()
			.then(async () => {
				try {
					const exp = form.getFieldValue('expiration');
					const tokenOption: TokenOptions = {
						expirationMonth: dayjs(exp).utc().format('MM'),
						expirationYear: dayjs(exp).utc().format('YYYY'),
					};
					await createToken(tokenOption);
				} catch (error) {
					console.log('Error creating token:', error);
					message.error('Card information is invalid.');
					// scroll to card number field
					form.scrollToField('cardNumber', {
						behavior: 'smooth',
						block: 'center',
					});
					return;
				}
				const values = form.getFieldsValue();
				console.log('Form values on submit:', values);
				const processPaymentDetails: ProcessPaymentInput = {
					userId: userId,
					paymentAmount: props.paymentAmount,
					currency: props.currency,
					paymentInstrument: {
						billingAddressLine1: values.billingAddress,
						billingAddressLine2: values.billingAddressLine2,
						billingCity: values.billingCity,
						billingState: values.billingState,
						billingPostalCode: values.billingPostalCode,
						billingCountry: values.billingCountry,
						billingEmail: values.billingEmail,
						billingFirstName: values.billingFirstName,
						billingLastName: values.billingLastName,
						paymentToken: values.paymentInstrumentToken,
					},
				};
				props.onSubmitPayment(processPaymentDetails);
			})
			.catch((error) => {
				// Use Ant Design Form API to scroll to first error field
				if (error?.errorFields && error.errorFields.length > 0) {
					form.scrollToField(error.errorFields[0].name, {
						behavior: 'smooth',
						block: 'center',
					});
				}
				console.log('Validation Failed:', error);
				message.error(
					'Please complete all required fields before submitting the form.',
				);
			});
	};

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const handleMicroformCreated = (microform: any) => {
		setFlexMicroform(microform);
	};

	const handleCardNumberChange = (isEmpty: boolean) => {
		if (isEmpty) {
			form.setFieldsValue({ cardNumber: undefined });
			return;
		}

		form.setFieldsValue({ cardNumber: '**** **** **** ****' }); // random string to suppress required validation error
	};

	const handleSecurityCodeChange = (isEmpty: boolean) => {
		if (isEmpty) {
			form.setFieldsValue({ securityCode: undefined });
			return;
		}
		form.setFieldsValue({ securityCode: '***' }); // random string to suppress required validation error
	};

	return (
		<div style={{ maxWidth: 500, margin: '0 auto' }}>
			<div style={{ textAlign: 'center', marginBottom: '2rem' }}>
				<Title
					level={1}
					className="title36"
					style={{
						textAlign: 'center',
						marginBottom: '32px',
						color: 'var(--color-message-text)',
					}}
				>
					Billing Information
				</Title>
			</div>

			<Form layout="vertical" form={form} >
				{/* card number, security code, expiration date fields*/}
				<PaymentTokenFormItems
					cyberSourcePublicKey={props.cyberSourcePublicKey}
					onMicroformCreated={handleMicroformCreated}
					onCardNumberChange={handleCardNumberChange}
					onSecurityCodeChange={handleSecurityCodeChange}
				/>

				{/* Billing Address */}
				<Title
					level={3}
					style={{ color: 'var(--color-message-text)', marginBottom: '16px' }}
				>
					Billing Address
				</Title>
				<BillingAddressFormItems countries={props.countries} />

				{props.additionalContent}

				<Form.Item style={{ textAlign: 'right', marginTop: '32px' }}>
					<Button
						type="primary"
						onClick={onSubmit}
						size="large"
						style={{
							width: '200px',
							height: '38px',
							fontSize: '16px',
							fontWeight: 600,
							borderRadius: '20px',
							backgroundColor: '#2c3e50',
							borderColor: '#2c3e50',
						}}
					>
						Save and Continue
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};
