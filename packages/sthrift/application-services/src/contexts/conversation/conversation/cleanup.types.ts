export interface CleanupResult {
	processedCount: number;
	scheduledCount: number;
	timestamp: Date;
	errors: string[];
}
