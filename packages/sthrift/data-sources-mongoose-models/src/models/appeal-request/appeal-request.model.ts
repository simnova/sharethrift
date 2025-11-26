import { type Model, Schema } from 'mongoose';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';

/**
 * Base interface for all appeal request types.
 * Uses discriminator pattern with 'type' field to differentiate between user and listing appeals.
 */
export interface AppealRequest extends MongooseSeedwork.Base {
	type: 'user' | 'listing';
}

/**
 * Schema options for AppealRequest base schema.
 * Uses 'type' as the discriminator key to support user and listing appeal subdomains.
 */
export const appealRequestOptions = {
	discriminatorKey: 'type',
	timestamps: true,
	collection: 'appealRequests',
};

/**
 * Base schema for all appeal requests.
 * Shared fields include user, reason, state, blocker, and timestamps.
 */
const AppealRequestSchema = new Schema<
	AppealRequest,
	Model<AppealRequest>,
	AppealRequest
>({}, appealRequestOptions);

export const AppealRequestModelName = 'AppealRequest';

/**
 * Factory function to create the base AppealRequest model.
 * @param connection - Mongoose connection instance
 * @returns AppealRequest model
 */
export const AppealRequestModelFactory =
	MongooseSeedwork.modelFactory<AppealRequest>(
		AppealRequestModelName,
		AppealRequestSchema,
	);

export type AppealRequestModelType = ReturnType<
	typeof AppealRequestModelFactory
>;
