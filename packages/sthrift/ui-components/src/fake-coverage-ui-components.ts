// --- FAKE: test coverage pipeline ---
// This file exists only to verify SonarCloud coverage reporting on the ui-components package.
// Safe to delete once coverage reporting is confirmed working.

export function truncateText(text: string, maxLength: number, ellipsis = '…'): string {
	if (maxLength <= 0) {
		return '';
	}
	if (text.length <= maxLength) {
		return text;
	}
	return text.substring(0, maxLength - ellipsis.length) + ellipsis;
}

export function formatCurrency(amount: number, currency = 'USD'): string {
	if (Number.isNaN(amount)) {
		return '--';
	}
	const sign = amount < 0 ? '-' : '';
	const absolute = Math.abs(amount).toFixed(2);
	return `${sign}${currency} ${absolute}`;
}

export function classNames(...classes: (string | false | null | undefined)[]): string {
	return classes.filter((c): c is string => typeof c === 'string' && c.length > 0).join(' ');
}
