import type { DataSources } from '@sthrift/persistence';
import { Domain } from '@sthrift/domain';
import { trace, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('conversation:cleanup');

const ARCHIVED_RESERVATION_REQUEST_STATES = [
	Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestStates
		.CLOSED,
	Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestStates
		.REJECTED,
	Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestStates
		.CANCELLED,
];

export interface CleanupResult {
	processedCount: number;
	scheduledCount: number;
	timestamp: Date;
	errors: string[];
}

export async function processConversationsForArchivedReservationRequests(
	dataSources: DataSources,
): Promise<CleanupResult> {
	return await tracer.startActiveSpan(
		'conversation.processConversationsForArchivedReservationRequests',
		async (span) => {
			let hadFatalError = false;
			const result: CleanupResult = {
				processedCount: 0,
				scheduledCount: 0,
				timestamp: new Date(),
				errors: [],
			};

			try {
				const archivedReservationRequests =
					await dataSources.readonlyDataSource.ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getByStates(
						ARCHIVED_RESERVATION_REQUEST_STATES,
					);

				span.setAttribute(
					'archivedReservationRequestsCount',
					archivedReservationRequests.length,
				);

				for (const reservationRequest of archivedReservationRequests) {
					try {
						await dataSources.domainDataSource.Conversation.Conversation.ConversationUnitOfWork.withScopedTransaction(
							async (repo) => {
								const conversations = await repo.getByReservationRequestId(
									reservationRequest.id,
								);
								result.processedCount += conversations.length;

								const conversationsToSchedule = conversations.filter(
									(c) => !c.expiresAt,
								);

								// NOTE: For CLOSED (completed) requests, use reservationPeriodEnd as the most
								// semantically correct anchor (end of the reservation period).
								// For REJECTED/CANCELLED, use updatedAt as a fallback since these don't have
								// a natural "completion" date. This may drift if the request is updated after
								// state change. Consider adding explicit completedAt/cancelledAt/rejectedAt
								// timestamps in the future for more precise retention tracking.
								const anchorDate =
									reservationRequest.state ===
									Domain.Contexts.ReservationRequest.ReservationRequest
										.ReservationRequestStates.CLOSED
										? reservationRequest.reservationPeriodEnd
										: reservationRequest.updatedAt;

								for (const conversation of conversationsToSchedule) {
									conversation.scheduleForDeletion(anchorDate);
									await repo.save(conversation);
									result.scheduledCount++;
								}
							},
						);
					} catch (err) {
						const message = err instanceof Error ? err.message : String(err);
						const msg = `Failed to process conversations for reservation request ${reservationRequest.id}: ${message}`;
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
					'[ConversationCleanup] Fatal cleanup error for reservation requests:',
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
							message: `${result.errors.length} reservation request(s) failed during cleanup`,
						});
					} else {
						span.setStatus({ code: SpanStatusCode.OK });
					}
				}

				span.end();

				console.log(
					`[ConversationCleanup] Reservation request cleanup complete. Processed: ${result.processedCount}, Scheduled: ${result.scheduledCount}, Errors: ${result.errors.length}`,
				);
			}

			return result;
		},
	);
}
