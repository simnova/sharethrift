import { trace } from '@opentelemetry/api';
import type { DataSources } from '@sthrift/persistence';

const tracer = trace.getTracer('reservation-request:delete-expired');

/**
 * Deletes expired reservation requests from the operational database.
 * Per SRD data retention policy: "Completed Reservation Requests: Any reservation requests in
 * the completed state will be deleted after 6 months have passed."
 *
 * This command is intended to be executed by a scheduled job (timer trigger) with system-level
 * permissions.
 *
 * @param dataSources - Data sources factory with system passport
 * @returns Number of deleted reservation requests
 */
export const deleteExpiredReservationRequests = (dataSources: DataSources) => {
	return async (): Promise<number> => {
		return await tracer.startActiveSpan(
			'deleteExpiredReservationRequests',
			async (span) => {
				try {
					const uow =
						dataSources.domainDataSource.ReservationRequest.ReservationRequest
							.ReservationRequestUnitOfWork;
					if (!uow) {
						throw new Error(
							'ReservationRequestUnitOfWork not available on dataSources.domainDataSource.ReservationRequest.ReservationRequest',
						);
					}

					// Get all expired closed reservation requests (CLOSED state for 6+ months)
					const expiredRequests =
						await dataSources.readonlyDataSource.ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getExpiredClosed();

					span.setAttribute(
						'reservation_requests.expired.count',
						expiredRequests.length,
					);

					if (expiredRequests.length === 0) {
						span.addEvent('No expired reservation requests found');
						console.log(
							'[deleteExpiredReservationRequests] No expired reservation requests to delete',
						);
						return 0;
					}

					console.log(
						`[deleteExpiredReservationRequests] Found ${expiredRequests.length} expired reservation requests to delete`,
					);

					let deletedCount = 0;

					// Delete each expired reservation request using the domain model
					for (const expiredRequestRef of expiredRequests) {
						try {
							await uow.withScopedTransaction(async (repo) => {
								const request = await repo.get(expiredRequestRef.id);

								// Domain method with system passport permission check
								// System passport grants canDeleteRequest permission
								request.requestDelete();

								// Repository detects isDeleted=true and performs hard delete
								await repo.save(request);

								deletedCount++;
								span.addEvent('Deleted expired reservation request', {
									'reservation_request.id': expiredRequestRef.id,
									'reservation_request.state': expiredRequestRef.state,
									'reservation_request.updatedAt':
										expiredRequestRef.updatedAt.toISOString(),
								});
							});
						} catch (error) {
							span.recordException(error as Error);
							console.error(
								`[deleteExpiredReservationRequests] Error deleting reservation request ${expiredRequestRef.id}:`,
								error,
							);
							// Continue with next request even if one fails
						}
					}

					span.setAttribute('reservation_requests.deleted.count', deletedCount);
					console.log(
						`[deleteExpiredReservationRequests] Successfully deleted ${deletedCount} expired reservation requests`,
					);

					return deletedCount;
				} catch (error) {
					span.recordException(error as Error);
					console.error(
						'[deleteExpiredReservationRequests] Fatal error:',
						error,
					);
					throw error;
				} finally {
					span.end();
				}
			},
		);
	};
};
