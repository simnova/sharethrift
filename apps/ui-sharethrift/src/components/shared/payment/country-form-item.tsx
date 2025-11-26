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
        optionFilterProp='label'
				options={props.countries.map((c) => ({
          key: c.countryCode,
					label: c.countryName,
					value: c.countryCode,
				}))}
			/>
		</Form.Item>
	);
};
