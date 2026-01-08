import type { TimerHandler } from '@azure/functions';
import type { ApplicationServicesFactory } from '@sthrift/application-services';
import { trace, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('timer:expired-listing-deletion');

export const expiredListingDeletionHandlerCreator = (
	applicationServicesFactory: ApplicationServicesFactory,
): TimerHandler => {
	return async (timer, context) => {
		await tracer.startActiveSpan('processExpiredListingDeletions', async (span) => {
			try {
				context.log('ExpiredListingDeletion: Timer triggered');

				if (timer.isPastDue) {
					context.log('ExpiredListingDeletion: Timer is past due');
				}

				const systemServices = applicationServicesFactory.forSystemTask();
				const result = await systemServices.Listing.ItemListing.processExpiredDeletions();

				span.setAttribute('deletedCount', result.deletedCount);
				span.setAttribute('errorCount', result.errors.length);

				context.log(
					`ExpiredListingDeletion: Completed - ${result.deletedCount} deleted, ${result.errors.length} errors`,
				);

				if (result.errors.length > 0) {
					context.log(`ExpiredListingDeletion: Errors: ${JSON.stringify(result.errors)}`);
				}

				span.setStatus({ code: SpanStatusCode.OK });
			} catch (error) {
				span.setStatus({ code: SpanStatusCode.ERROR });
				if (error instanceof Error) {
					span.recordException(error);
					context.error(`ExpiredListingDeletion: Failed - ${error.message}`);
				}
				throw error;
			} finally {
				span.end();
			}
		});
	};
};
