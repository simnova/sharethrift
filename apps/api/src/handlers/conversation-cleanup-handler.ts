import type { TimerHandler, Timer, InvocationContext } from '@azure/functions';
import type { ApplicationServicesFactory } from '@sthrift/application-services';
import { trace, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('handler:conversation-cleanup');

export const conversationCleanupHandlerCreator = (
	applicationServicesFactory: ApplicationServicesFactory,
): TimerHandler => {
	return async (timer: Timer, context: InvocationContext): Promise<void> => {
		return await tracer.startActiveSpan(
			'conversationCleanup.timerHandler',
			async (span) => {
				try {
					span.setAttribute('timer.isPastDue', timer.isPastDue);
					span.setAttribute(
						'timer.scheduledTime',
						timer.scheduleStatus?.next ?? 'unknown',
					);

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

					span.setAttribute('result.processedCount', result.processedCount);
					span.setAttribute('result.scheduledCount', result.scheduledCount);
					span.setAttribute('result.errorsCount', result.errors.length);

					context.log(
						`[ConversationCleanup] Completed. Processed: ${result.processedCount}, Scheduled: ${result.scheduledCount}, Errors: ${result.errors.length}`,
					);

					if (result.errors.length > 0) {
						context.warn(
							`[ConversationCleanup] Errors: ${result.errors.join('; ')}`,
						);
					}

					span.setStatus({ code: SpanStatusCode.OK });
				} catch (error) {
					span.setStatus({ code: SpanStatusCode.ERROR });
					if (error instanceof Error) {
						span.recordException(error);
						context.error(`[ConversationCleanup] Failed: ${error.message}`);
					}
					throw error;
				} finally {
					span.end();
				}
			},
		);
	};
};
