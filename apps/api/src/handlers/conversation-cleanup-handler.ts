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

		try {
			const appServices = await applicationServicesFactory.forRequest();

			const listingsResult =
				await appServices.Conversation.Conversation.processConversationsForArchivedListings();

			context.log(
				`[ConversationCleanup] Listings cleanup complete. Processed: ${listingsResult.processedCount}, Scheduled: ${listingsResult.scheduledCount}, Errors: ${listingsResult.errors.length}`,
			);

			if (listingsResult.errors.length > 0) {
				context.log(
					`[ConversationCleanup] Listings errors: ${listingsResult.errors.join('; ')}`,
				);
			}

			const reservationsResult =
				await appServices.Conversation.Conversation.processConversationsForArchivedReservationRequests();

			context.log(
				`[ConversationCleanup] Reservation requests cleanup complete. Processed: ${reservationsResult.processedCount}, Scheduled: ${reservationsResult.scheduledCount}, Errors: ${reservationsResult.errors.length}`,
			);

			if (reservationsResult.errors.length > 0) {
				context.log(
					`[ConversationCleanup] Reservation requests errors: ${reservationsResult.errors.join('; ')}`,
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
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			context.log(`[ConversationCleanup] Fatal error: ${message}`);
			throw error;
		}
	};
};
