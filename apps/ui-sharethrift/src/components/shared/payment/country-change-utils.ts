import type { ZipcodeRule } from './billing-address-form-items';
import type { FormInstance } from 'antd';

/**
 * Reusable handler for country change in forms with country/state/zip fields.
 * @param value The selected country code (e.g., 'US', 'CA', ...)
 * @param form The AntD Form instance
 * @param setZipCodeRules Setter for zip code rules (from useState)
 */
export function handleCountryChange(
	value: string,
	form: FormInstance,
	setZipCodeRules: (rules: ZipcodeRule[]) => void,
) {
	form.resetFields(['state']);
	switch (value) {
		case 'US':
			setZipCodeRules([
				{ required: true, message: 'Please enter the ZIP/Postal code' },
				{
					pattern: /^\d{5}(?:[-\s]\d{4})?$/,
					message: 'Please enter a valid ZIP/Postal code',
				},
			]);
			break;
		case 'CA':
			setZipCodeRules([
				{ required: true, message: 'Please enter the ZIP/Postal code' },
				{
					pattern: /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/,
					message: 'Please enter a valid ZIP/Postal code',
				},
			]);
			break;
		default:
			setZipCodeRules([
				{ required: true, message: 'Please enter the ZIP/Postal code' },
			]);
			break;
	}
}
