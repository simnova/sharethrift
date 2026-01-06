import type { InvocationContext, Timer, TimerHandler } from '@azure/functions';
import { trace } from '@opentelemetry/api';
import type { ApplicationServices } from '@sthrift/application-services';
import type { AppHost } from '@sthrift/context-spec';

const tracer = trace.getTracer('timer:cleanup-expired-reservation-requests');

/**
 * Timer handler creator for deleting expired reservation requests
 * Runs daily at 2 AM UTC per NCRONTAB schedule: "0 0 2 * * *"
 *
 * Per SRD data retention policy: "Completed Reservation Requests: Any reservation requests in
 * the completed state will be deleted after 6 months have passed."
 *
 * @param applicationServicesHost - Application services host with system-level permissions
 * @returns TimerHandler function
 */
export const cleanupExpiredReservationRequestsHandlerCreator = (
	applicationServicesHost: AppHost<ApplicationServices>,
): TimerHandler => {
	return async (timer: Timer, context: InvocationContext): Promise<void> => {
		return await tracer.startActiveSpan(
			'cleanupExpiredReservationRequests.handler',
			async (span) => {
				try {
					span.setAttribute('timer.isPastDue', timer.isPastDue);
					span.setAttribute('timer.schedule.last', timer.scheduleStatus.last);
					span.setAttribute('timer.schedule.next', timer.scheduleStatus.next);

					context.log(
						'[cleanupExpiredReservationRequests] Timer trigger function started',
						{
							isPastDue: timer.isPastDue,
							last: timer.scheduleStatus.last,
							next: timer.scheduleStatus.next,
						},
					);

					// Get application services with system-level permissions
					// System passport has canDeleteRequest permission
					const app = await applicationServicesHost.forRequest();

					// Execute deletion of expired reservation requests
					const deletedCount =
						await app.ReservationRequest.deleteExpiredReservationRequests();

					span.setAttribute('reservation_requests.deleted.count', deletedCount);

					context.log(
						`[cleanupExpiredReservationRequests] Completed. Deleted ${deletedCount} expired reservation requests`,
					);
				} catch (error) {
					span.recordException(error as Error);
					context.error(
						'[cleanupExpiredReservationRequests] Error during cleanup:',
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
