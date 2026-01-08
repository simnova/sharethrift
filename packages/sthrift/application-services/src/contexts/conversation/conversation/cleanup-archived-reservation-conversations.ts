import type { DataSources } from '@sthrift/persistence';
import { Domain } from '@sthrift/domain';
import { processArchivedEntities } from './cleanup-shared.ts';
import type { CleanupResult } from './cleanup.types.ts';

const ARCHIVED_RESERVATION_REQUEST_STATES = [
	Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestStates
		.CLOSED,
	Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestStates
		.REJECTED,
	Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestStates
		.CANCELLED,
];

export function processConversationsForArchivedReservationRequests(
	dataSources: DataSources,
): Promise<CleanupResult> {
	return processArchivedEntities({
		spanName: 'conversation.processConversationsForArchivedReservationRequests',
		entityLabel: 'reservation request',
		fetchEntities: () =>
			dataSources.readonlyDataSource.ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getByStates(
				ARCHIVED_RESERVATION_REQUEST_STATES,
			),
		processEntity: async (reservationRequest) => {
			let processed = 0;
			let scheduled = 0;
			const errors: string[] = [];

			await dataSources.domainDataSource.Conversation.Conversation.ConversationUnitOfWork.withScopedTransaction(
				async (repo) => {
					const conversations = await repo.getByReservationRequestId(
						reservationRequest.id,
					);
					processed += conversations.length;

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

					// Guard against undefined anchorDate - skip scheduling if missing
					if (!anchorDate) {
						const msg = `Skipping reservation request ${reservationRequest.id}: anchorDate is undefined (state: ${reservationRequest.state})`;
						errors.push(msg);
						console.warn('[ConversationCleanup]', msg);
						return;
					}

					for (const conversation of conversationsToSchedule) {
						conversation.scheduleForDeletion(anchorDate);
						await repo.save(conversation);
						scheduled++;
					}
				},
			);

			return { processed, scheduled, errors };
		},
	});
}
