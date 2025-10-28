import type { FC } from 'react';
import { Form, Select } from 'antd';
import type { Country } from './country-type.ts';

interface CountryFormItemProps {
	onCountryChange: (value: string) => void;
	countries: Country[];
	fieldPath: string | string[];
}
export const CountryFormItem: FC<CountryFormItemProps> = (props) => {
	return (
		<Form.Item
			name={props.fieldPath}
			label={'Country'}
			rules={[{ required: true, message: 'Please select the country.' }]}
		>
			<Select
				placeholder="Country"
				onChange={props.onCountryChange}
				showSearch
				optionFilterProp="children"
			>
				{props.countries?.map((item: Country) => (
					<Select.Option key={item.countryCode} value={item.countryCode}>
						{item.countryName}
					</Select.Option>
				))}
			</Select>
		</Form.Item>
	);
};
