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

		const result =
			await appServices.Conversation.Conversation.processConversationsForArchivedListings();

		context.log(
			`[ConversationCleanup] Completed. Processed: ${result.processedCount}, Scheduled: ${result.scheduledCount}, Errors: ${result.errors.length}`,
		);

		if (result.errors.length > 0) {
			context.log(`[ConversationCleanup] Errors: ${result.errors.join('; ')}`);
		}
	};
};
