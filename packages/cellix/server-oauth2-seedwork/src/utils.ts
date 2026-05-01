/** Utility helpers for server-oauth2-seedwork */

export const SAFE_NAME_RE = /^[a-zA-Z0-9_-]+$/;

export const normalizeUrl = (value: string) => {
	try {
		const url = new URL(value);
		const pathname = url.pathname.replace(/\/$/, '') || '/';
		const params = new URLSearchParams(url.search);
		params.sort();
		const search = params.toString() ? `?${params.toString()}` : '';
		return `${url.origin}${pathname}${search}`;
	} catch {
		return value;
	}
};

export const normalizeOrigin = (value: string) => {
	try {
		return new URL(value).origin;
	} catch {
		return value;
	}
};

export const normalizeBaseUrl = (value: string) => {
	return value.replace(/\/$/, '');
};
