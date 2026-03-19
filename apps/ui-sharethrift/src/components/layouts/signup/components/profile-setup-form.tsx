import type { FC } from 'react';
import {
	Form,
	Input,
	Row,
	Col,
	Typography,
	Button,
	type FormInstance,
} from 'antd';
import { CountryFormItem } from '../../../shared/payment/country-form-item.tsx';
import { StateProvinceFormItem } from '../../../shared/payment/state-province-form-item.tsx';
import type {
	PersonalUser,
	PersonalUserUpdateInput,
} from '../../../../generated.tsx';
import type { Country } from '../../../shared/payment/country-type.ts';
import type { ZipcodeRule } from '../../../shared/payment/billing-address-form-items.tsx';

const { Title } = Typography;

interface ProfileSetupFormProps {
	loading: boolean;
	currentPersonalUserData?: PersonalUser;
	onSaveAndContinue: (values: PersonalUserUpdateInput) => void;
	countries: Country[];
	form: FormInstance;
	selectedCountry?: string;
	onCountryChange: (countryCode: string) => void;
	zipCodeRules: ZipcodeRule[];
}
export const ProfileSetupForm: FC<ProfileSetupFormProps> = (props) => {
	return (
		<Form
			form={props.form}
			layout="vertical"
			onFinish={props.onSaveAndContinue}
			autoComplete="off"
			initialValues={props.currentPersonalUserData}
		>
			{/* hidden field to store the user ID */}
			<Form.Item label="User ID" name={['id']} style={{ display: 'none' }}>
				<Input aria-label="User ID" autoComplete="off" />
			</Form.Item>

			<Row gutter={16} style={{ flexWrap: 'nowrap' }}>
				<Col
					xs={12}
					sm={12}
					style={{
						paddingRight: 8,
						paddingLeft: 0,
						flex: 1,
						maxWidth: '50%',
					}}
				>
					<Form.Item
						label="First Name"
						name={['account', 'profile', 'firstName']}
						style={{ marginBottom: 5 }}
					>
						<Input placeholder="Your First Name" />
					</Form.Item>
				</Col>
				<Col
					xs={12}
					sm={12}
					style={{
						paddingLeft: 8,
						paddingRight: 0,
						flex: 1,
						maxWidth: '50%',
					}}
				>
					<Form.Item
						label="Last Name"
						name={['account', 'profile', 'lastName']}
						style={{ marginBottom: 5 }}
					>
						<Input placeholder="Your Last Name" />
					</Form.Item>
				</Col>
			</Row>

			<Title level={4} style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
				Location
			</Title>

			<Form.Item
				label="Address Line 1"
				name={['account', 'profile', 'location', 'address1']}
				rules={[{ required: true, message: 'Address is required' }]}
			>
				<Input placeholder="Address Line 1" />
			</Form.Item>

			<Form.Item
				label="Address Line 2"
				name={['account', 'profile', 'location', 'address2']}
			>
				<Input placeholder="Address Line 2" />
			</Form.Item>

			<Row gutter={16} style={{ flexWrap: 'nowrap', marginLeft: 0 }}>
				<Col
					xs={12}
					sm={12}
					style={{
						paddingRight: 8,
						paddingLeft: 0,
						flex: 1,
						maxWidth: '50%',
					}}
				>
					<Form.Item
						label="City"
						name={['account', 'profile', 'location', 'city']}
						rules={[{ required: true, message: 'City is required' }]}
					>
						<Input placeholder="City" />
					</Form.Item>
				</Col>
				<Col
					xs={12}
					sm={12}
					style={{
						paddingLeft: 0,
						paddingRight: 8,
						flex: 1,
						maxWidth: '50%',
					}}
				>
					<CountryFormItem
						fieldPath={['account', 'profile', 'location', 'country']}
						onCountryChange={props.onCountryChange}
						countries={props.countries}
					/>
				</Col>
			</Row>
			<Row gutter={16} style={{ flexWrap: 'nowrap', marginLeft: 0 }}>
				<Col
					xs={12}
					sm={12}
					style={{
						paddingLeft: 0,
						paddingRight: 8,
						flex: 1,
						maxWidth: '50%',
					}}
				>
					<StateProvinceFormItem
						fieldPath={['account', 'profile', 'location', 'state']}
						states={
							props.countries.find(
								(country) => country.countryCode === props.selectedCountry,
							)?.states || []
						}
						isBillingFormItem={false}
					/>
				</Col>
				<Col
					xs={12}
					sm={12}
					style={{
						paddingLeft: 0,
						paddingRight: 8,
						flex: 1,
						maxWidth: '50%',
					}}
				>
					<Form.Item
						label="Zip Code"
						name={['account', 'profile', 'location', 'zipCode']}
						rules={props.zipCodeRules}
					>
						<Input placeholder="Zip Code" />
					</Form.Item>
				</Col>
			</Row>

			<Form.Item style={{ marginTop: '2rem', textAlign: 'right' }}>
				<Button
					type="primary"
					htmlType="submit"
					size="large"
					style={{
						width: '180px',
						height: '38px',
						fontSize: '16px',
						fontWeight: 600,
					}}
					loading={props.loading}
				>
					Save and Continue
				</Button>
			</Form.Item>
		</Form>
	);
};
