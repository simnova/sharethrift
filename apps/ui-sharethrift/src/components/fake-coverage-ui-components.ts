// --- FAKE: test coverage pipeline ---
// Components-level ui-sharethrift coverage probe. Safe to delete.

export function formatUserDisplayName(firstName?: string, lastName?: string): string {
	const first = firstName?.trim() ?? '';
	const last = lastName?.trim() ?? '';
	if (first.length === 0 && last.length === 0) {
		return 'Anonymous';
	}
	if (first.length === 0) {
		return last;
	}
	if (last.length === 0) {
		return first;
	}
	return `${first} ${last}`;
}

export function getInitials(name: string): string {
	const parts = name.trim().split(/\s+/).filter((p) => p.length > 0);
	if (parts.length === 0) {
		return '??';
	}
	if (parts.length === 1) {
		return (parts[0]?.substring(0, 2) ?? '').toUpperCase();
	}
	const first = parts[0]?.[0] ?? '';
	const last = parts[parts.length - 1]?.[0] ?? '';
	return `${first}${last}`.toUpperCase();
}
