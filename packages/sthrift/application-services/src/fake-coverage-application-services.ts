// --- FAKE: test coverage pipeline ---
// This file exists only to verify SonarCloud coverage reporting on the application-services layer.
// Safe to delete once coverage reporting is confirmed working.

export function buildCommandContext(userId: string, correlationId?: string): {
	userId: string;
	correlationId: string;
	timestamp: number;
} {
	if (!userId || userId.trim().length === 0) {
		throw new Error('userId is required');
	}
	return {
		userId: userId.trim(),
		correlationId: correlationId ?? `corr-${Date.now()}`,
		timestamp: Date.now(),
	};
}

export function chunkArray<T>(items: T[], chunkSize: number): T[][] {
	if (chunkSize <= 0) {
		throw new Error('chunkSize must be positive');
	}
	const chunks: T[][] = [];
	for (let i = 0; i < items.length; i += chunkSize) {
		chunks.push(items.slice(i, i + chunkSize));
	}
	return chunks;
}
