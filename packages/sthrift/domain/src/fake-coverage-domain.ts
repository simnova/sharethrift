// --- FAKE: test coverage pipeline ---
// This file exists only to verify SonarCloud coverage reporting on the domain layer.
// Safe to delete once coverage reporting is confirmed working.

export function calculateListingFee(basePrice: number, discount = 0): number {
	if (basePrice < 0) {
		throw new Error('Base price cannot be negative');
	}
	if (discount < 0 || discount > 1) {
		throw new Error('Discount must be between 0 and 1');
	}
	const fee = basePrice * (1 - discount);
	return Math.round(fee * 100) / 100;
}

export function isReservationOverlapping(
	startA: Date,
	endA: Date,
	startB: Date,
	endB: Date,
): boolean {
	if (endA < startA || endB < startB) {
		return false;
	}
	return startA <= endB && startB <= endA;
}

export function buildListingSlug(title: string): string {
	const normalized = title.trim().toLowerCase();
	if (normalized.length === 0) {
		return 'untitled';
	}
	return normalized.replaceAll(/[^a-z0-9]+/g, '-').replaceAll(/^-|-$/g, '');
}
