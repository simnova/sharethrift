import { Row, Col, Input, Form } from 'antd';
import { handleCountryChange } from './country-change-utils.ts';
import { useState, type FC } from 'react';
import type { Country } from './country-type.ts';
import { StateProvinceFormItem } from './state-province-form-item.tsx';
import { CountryFormItem } from './country-form-item.tsx';

const COLUMN_SPAN = 24 / 2;

interface BillingAddressFormItemsProps {
	countries: Country[];
}

export type ZipcodeRule = {
	required?: boolean;
	message?: string;
	pattern?: RegExp;
};

const CountryFieldPath = 'billingCountry';

export const BillingAddressFormItems: FC<BillingAddressFormItemsProps> = (
	props,
) => {
	const [zipCodeRules, setZipCodeRules] = useState<ZipcodeRule[]>([
		{ required: true, message: 'Please enter the ZIP/Postal code.' },
	]);
	const form = Form.useFormInstance();
	const selectedCountry = Form.useWatch(CountryFieldPath, form);

	const onCountryChange = (value: string) => {
		handleCountryChange(value, form, setZipCodeRules, 'billingState');
	};

	return (
		<>
			<Row gutter={[16, 8]}>
				<Col xs={24} sm={12}>
					<Form.Item
						label="First Name on Card"
						name="billingFirstName"
						rules={[
							{ required: true, message: 'Please enter valid First Name' },
						]}
					>
						<Input placeholder="First Name on Card" />
					</Form.Item>
				</Col>
				<Col xs={24} sm={12}>
					<Form.Item
						label="Last Name on Card "
						name="billingLastName"
						rules={[
							{ required: true, message: 'Please enter valid Last Name' },
						]}
					>
						<Input placeholder="Last Name on Card" />
					</Form.Item>
				</Col>
				<Form.Item name="paymentInstrumentToken" hidden>
					<Input />
				</Form.Item>
			</Row>

			<Row>
				<Col span={COLUMN_SPAN * 2} xs={24}>
					<Form.Item
						label="Email Address"
						name="billingEmail"
						rules={[
							{
								required: true,
								message: 'Please enter a valid email address.',
							},
							{
								type: 'email',
								message: 'Please enter a valid email address.',
							},
						]}
					>
						<Input type="text" maxLength={500} placeholder="Email Address" />
					</Form.Item>
				</Col>
			</Row>

			<Row>
				<Col span={COLUMN_SPAN * 2} xs={24}>
					<CountryFormItem
						fieldPath={CountryFieldPath}
						onCountryChange={onCountryChange}
						countries={props.countries}
					/>
				</Col>
			</Row>

			<Row>
				<Col span={COLUMN_SPAN * 2} xs={24}>
					<Form.Item
						label="Billing Address"
						name="billingAddress"
						rules={[
							{
								required: true,
								message: 'Please enter the billing street address.',
							},
						]}
					>
						<Input placeholder="Billing Address" />
					</Form.Item>
				</Col>
			</Row>

			<Row>
				<Col span={COLUMN_SPAN} xs={24}>
					<Form.Item
						label="Billing City"
						name="billingCity"
						rules={[
							{ required: true, message: 'Please enter the billing city.' },
							{
								max: 500,
								message: 'City name cannot exceed 500 characters.',
							},
						]}
					>
						<Input placeholder="Billing City" />
					</Form.Item>
				</Col>
			</Row>
			<Row>
				<Col span={COLUMN_SPAN} xs={24}>
					<StateProvinceFormItem
						fieldPath="billingState"
						states={
							props.countries?.find(
								(country: Country) => country.countryCode === selectedCountry,
							)?.states || []
						}
						isBillingFormItem={true}
					/>
				</Col>
			</Row>
			<Row>
				<Col span={COLUMN_SPAN} xs={24}>
					<Form.Item
						label="Billing ZIP / Postal Code"
						name="billingPostalCode"
						rules={zipCodeRules}
					>
						<Input placeholder="Billing ZIP / Postal Code" />
					</Form.Item>
				</Col>
			</Row>
		</>
	);
};
