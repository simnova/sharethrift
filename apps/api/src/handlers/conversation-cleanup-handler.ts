import type { TimerHandler, Timer, InvocationContext } from '@azure/functions';
import type { ApplicationServicesFactory } from '@sthrift/application-services';

export const conversationCleanupHandlerCreator = (
	applicationServicesFactory: ApplicationServicesFactory,
): TimerHandler => {
	return async (timer: Timer, context: InvocationContext): Promise<void> => {
		context.log(
			`[ConversationCleanup] Timer trigger fired at ${new Date().toISOString()}`,
		);

		if (timer.isPastDue) {
			context.log(
				'[ConversationCleanup] Timer is past due, running catch-up execution',
			);
		}

		const appServices = await applicationServicesFactory.forRequest();

		let listingsResult = {
			processedCount: 0,
			scheduledCount: 0,
			errors: [] as string[],
		};
		let listingsFatalError: Error | null = null;

		try {
			listingsResult =
				await appServices.Conversation.Conversation.processConversationsForArchivedListings();

			context.log(
				`[ConversationCleanup] Listings cleanup complete. Processed: ${listingsResult.processedCount}, Scheduled: ${listingsResult.scheduledCount}, Errors: ${listingsResult.errors.length}`,
			);

			if (listingsResult.errors.length > 0) {
				context.log(
					`[ConversationCleanup] Listings errors: ${listingsResult.errors.join('; ')}`,
				);
			}
		} catch (error) {
			listingsFatalError =
				error instanceof Error ? error : new Error(String(error));
			context.log(
				`[ConversationCleanup] Fatal error in listings cleanup: ${listingsFatalError.message}`,
			);
		}

		let reservationsResult = {
			processedCount: 0,
			scheduledCount: 0,
			errors: [] as string[],
		};
		let reservationsFatalError: Error | null = null;

		try {
			reservationsResult =
				await appServices.Conversation.Conversation.processConversationsForArchivedReservationRequests();

			context.log(
				`[ConversationCleanup] Reservation requests cleanup complete. Processed: ${reservationsResult.processedCount}, Scheduled: ${reservationsResult.scheduledCount}, Errors: ${reservationsResult.errors.length}`,
			);

			if (reservationsResult.errors.length > 0) {
				context.log(
					`[ConversationCleanup] Reservation requests errors: ${reservationsResult.errors.join('; ')}`,
				);
			}
		} catch (error) {
			reservationsFatalError =
				error instanceof Error ? error : new Error(String(error));
			context.log(
				`[ConversationCleanup] Fatal error in reservation requests cleanup: ${reservationsFatalError.message}`,
			);
		}

		const totalProcessed =
			listingsResult.processedCount + reservationsResult.processedCount;
		const totalScheduled =
			listingsResult.scheduledCount + reservationsResult.scheduledCount;
		const totalErrors =
			listingsResult.errors.length + reservationsResult.errors.length;

		context.log(
			`[ConversationCleanup] Overall totals - Processed: ${totalProcessed}, Scheduled: ${totalScheduled}, Errors: ${totalErrors}`,
		);

		if (listingsFatalError && reservationsFatalError) {
			context.log(
				'[ConversationCleanup] Both cleanup phases failed - throwing combined error',
			);
			throw new Error(
				`Both cleanup phases failed. Listings: ${listingsFatalError.message}; Reservations: ${reservationsFatalError.message}`,
			);
		}

		if (listingsFatalError) {
			throw listingsFatalError;
		}
		if (reservationsFatalError) {
			throw reservationsFatalError;
		}
	};
};
