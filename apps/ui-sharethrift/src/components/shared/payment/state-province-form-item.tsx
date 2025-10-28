import type { FC } from 'react';
import type { Country, State } from './country-type.ts';
import { Form, Select, Input } from 'antd';

interface StateProvinceFormItemProps {
	countries: Country[];
	selectedCountry: string;
	fieldPath: string | string[];
}
export const StateProvinceFormItem: FC<StateProvinceFormItemProps> = (
	props,
) => {
	const states = props.countries?.find(
		(country: Country) => country.countryCode === props.selectedCountry,
	)?.states;
	if (states && states.length > 0) {
		return (
			<Form.Item
				label="State / Province"
				name={props.fieldPath}
				rules={[{ required: true, message: 'Please enter the state.' }]}
			>
				<Select
					placeholder="State / Province"
					optionFilterProp="children"
					showSearch
					filterOption={(input, option) =>
						option?.label
							? option?.label
									.toString()
									.toLowerCase()
									.includes(input.toLowerCase())
							: false
					}
					options={states.map((d: State) => ({
						value: d.stateCode,
						label: d.stateName,
					}))}
				/>
			</Form.Item>
		);
	} else {
		return (
			<Form.Item
				label="Billing State / Province"
				name={props.fieldPath}
				rules={[{ required: true, message: 'Please enter the state.' }]}
			>
				<Input type="text" placeholder="Billing State / Province" />
			</Form.Item>
		);
	}
};
