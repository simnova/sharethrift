import { type Span, SpanStatusCode, trace } from '@opentelemetry/api';
import type { CleanupResult } from './cleanup.types.ts';

const tracer = trace.getTracer('conversation:cleanup');

export function processArchivedEntities<T extends { id: string }>({
	spanName,
	fetchEntities,
	processEntity,
	entityLabel,
}: {
	spanName: string;
	fetchEntities: () => Promise<T[]>;
	processEntity: (
		entity: T,
		span: Span,
	) => Promise<{
		processed: number;
		scheduled: number;
		errors: string[];
	}>;
	entityLabel: string;
}): Promise<CleanupResult> {
	return tracer.startActiveSpan(spanName, async (span) => {
		let hadFatalError = false;
		const result: CleanupResult = {
			processedCount: 0,
			scheduledCount: 0,
			timestamp: new Date(),
			errors: [],
		};

		try {
			const entities = await fetchEntities();
			span.setAttribute(`${entityLabel}Count`, entities.length);

			for (const entity of entities) {
				try {
					const { processed, scheduled, errors } = await processEntity(
						entity,
						span,
					);

					result.processedCount += processed;
					result.scheduledCount += scheduled;
					result.errors.push(...errors);
				} catch (err) {
					const message = err instanceof Error ? err.message : String(err);
					const msg = `Failed to process ${entityLabel} ${entity.id}: ${message}`;
					result.errors.push(msg);
					console.error('[ConversationCleanup]', msg);
				}
			}
		} catch (error) {
			hadFatalError = true;
			span.setStatus({ code: SpanStatusCode.ERROR });
			if (error instanceof Error) {
				span.recordException(error);
			}
			console.error(
				`[ConversationCleanup] Fatal cleanup error for ${entityLabel}s:`,
				error,
			);
			throw error;
		} finally {
			span.setAttribute('processedCount', result.processedCount);
			span.setAttribute('scheduledCount', result.scheduledCount);
			span.setAttribute('errorsCount', result.errors.length);

			if (!hadFatalError) {
				if (result.errors.length > 0) {
					span.setStatus({
						code: SpanStatusCode.ERROR,
						message: `${result.errors.length} ${entityLabel}(s) failed during cleanup`,
					});
				} else {
					span.setStatus({ code: SpanStatusCode.OK });
				}
			}

			span.end();

			console.log(
				`[ConversationCleanup] ${entityLabel} cleanup complete. Processed: ${result.processedCount}, Scheduled: ${result.scheduledCount}, Errors: ${result.errors.length}`,
			);
		}

		return result;
	});
}
