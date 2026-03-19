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
	stateFieldPath: string | string[],
) {
	// Reset the state/province field when country changes
	form.setFieldValue(stateFieldPath, undefined);
	switch (value) {
		case 'US':
			setZipCodeRules([
				{ required: true, message: 'Please enter your US ZIP code' },
				{
					pattern: /^\d{5}(?:[-\s]\d{4})?$/,
					message: 'US ZIP code format: 12345 or 12345-6789',
				},
			]);
			break;
		case 'CA':
			setZipCodeRules([
				{ required: true, message: 'Please enter your Canadian postal code' },
				{
					pattern: /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/,
					message: 'Canadian postal code format: A1A1A1 or A1A 1A1',
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
