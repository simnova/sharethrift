import { Col, DatePicker, Form, Row } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState, type FC } from 'react';
import utc from 'dayjs/plugin/utc';
import './flex-microform.css';
dayjs.extend(utc);
type PaymentTokenFormFieldType = {
	cardNumber?: string;
	securityCode?: string;
	expiration?: string;
};

export interface TokenOptions {
	expirationMonth: string;
	expirationYear: string;
}

interface PaymentTokenFormItemsProps {
	cyberSourcePublicKey: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	onMicroformCreated: (microform: any) => void;
	onCardNumberChange: (isEmpty: boolean) => void;
	onSecurityCodeChange: (isEmpty: boolean) => void;
}

export const PaymentTokenFormItems: FC<PaymentTokenFormItemsProps> = (
	props,
) => {
	const cyberSourceUrl =
		'https://testflex.cybersource.com/microform/bundle/v2/flex-microform.min.js';
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	const createFlexObj = useCallback(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		(
			keyId: string,
			clearValidationText: (data: any, field: string) => void,
		): void => {
			try {
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				const flex = new (window as { [key: string]: any })['Flex'](keyId);

				// Setup styles for flex iframe
				const myStyles = {
					input: {
						'font-size': '14px',
						'font-family': 'helvetica, tahoma, calibri, sans-serif',
						color: '#555',
						'line-height': '30px',
					},
					':focus': { color: 'black' },
					':disabled': { cursor: 'not-allowed' },
					valid: { color: '#3c763d' },
					invalid: { color: '#a94442' },
					'::placeholder': { color: '#A4A4A4' },
				};
				const microform = flex.microform('card', { styles: myStyles });
				console.log('MICROFORM', microform);
				props.onMicroformCreated(microform);

				// Create fields
				const number = microform.createField('number', {
					placeholder: 'Enter card number',
				});
				const securityCode = microform.createField('securityCode', {
					maxLength: 4,
					placeholder: '••••',
					type: 'password',
				});

				// Add event listeners
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				number.on('change', (data: any) => {
					clearValidationText(data, 'number');
				});
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				securityCode.on('change', (data: any) => {
					clearValidationText(data, 'securityCode');
				});

				// Load fields
				number.load('#card-number-container');
				securityCode.load('#securityCode-container');
			} catch (error) {
				console.log('MICROFORM ERROR', error);
			}
		},
		[props.onMicroformCreated],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		let microformScript: HTMLScriptElement;

		if (props.cyberSourcePublicKey && hasMounted && cyberSourceUrl) {
			microformScript = document.createElement('script');
			microformScript.src = cyberSourceUrl;
			microformScript.async = true;
			microformScript.onload = () => {
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				createFlexObj(
					props.cyberSourcePublicKey || '',
					(data: any, field: string) => {
						switch (field) {
							case 'number':
								props.onCardNumberChange(data.empty);
								break;
							case 'securityCode':
								props.onSecurityCodeChange(data.empty);
								break;
						}
					},
				);
			};

			document.body.appendChild(microformScript);
		}

		return () => {
			if (microformScript) {
				microformScript.remove();
			}
		};
	}, [hasMounted, props.cyberSourcePublicKey, cyberSourceUrl]);

	return (
		<>
			<Form.Item<PaymentTokenFormFieldType>
				label={
					<span style={{ color: 'var(--color-message-text)' }}>
						Card Number
					</span>
				}
				name="cardNumber"
				required={true}
				rules={[{ required: true, message: 'Please provide the card number.' }]}
			>
				{/** biome-ignore lint/nursery/useUniqueElementIds: <explanation> */}
				<div id="card-number-container" />
			</Form.Item>

			<Row gutter={[16, 8]}>
				<Col xs={24} sm={12}>
					<Form.Item<PaymentTokenFormFieldType>
						label={
							<span style={{ color: 'var(--color-message-text)' }}>
								Expiration Date
							</span>
						}
						required={true}
						name="expiration"
						rules={[
							{
								required: true,
								message:
									'Please enter the expiration date as shown on the card.',
							},
						]}
					>
						{/** biome-ignore lint/nursery/useUniqueElementIds: <explanation> */}
						<DatePicker.MonthPicker
							style={{ borderRadius: '3px' }}
							id="expirationMonthPicker"
							name="expirationMonthPicker"
							placeholder="Month-Year"
							format="MM-YYYY"
							disabledDate={(current: any) => {
								return (
									current &&
									current < dayjs().utc().endOf('day').subtract(1, 'day')
								);
							}}
							className="w-full"
						/>
					</Form.Item>
				</Col>

				<Col xs={24} sm={12}>
					<Form.Item<PaymentTokenFormFieldType>
						label={
							<span style={{ color: 'var(--color-message-text)' }}>
								Security Code
							</span>
						}
						required={true}
						name="securityCode"
						rules={[
							{ required: true, message: 'Please enter the security code.' },
						]}
						// help={securityCodeValidationHelpText}
					>
						{/** biome-ignore lint/nursery/useUniqueElementIds: <explanation> */}
						<div id="securityCode-container" />
					</Form.Item>
				</Col>
			</Row>
		</>
	);
};
