import {
	Schema,
	type Model,
	type ObjectId,
	type PopulatedDoc,
} from 'mongoose';
import {
	type AppealRequest,
	type AppealRequestModelType,
	appealRequestOptions,
} from './appeal-request.model.ts';
import * as PersonalUser from '../user/personal-user.model.ts';
import { APPEAL_REQUEST_STATE_ENUM } from './listing-appeal-request.model.ts';

/**
 * Interface for UserAppealRequest discriminator.
 * Represents an appeal request for a blocked user account.
 */
export interface UserAppealRequest extends AppealRequest {
	user: PopulatedDoc<PersonalUser.PersonalUser> | ObjectId;
	reason: string;
	state: 'requested' | 'denied' | 'accepted';
	blocker: PopulatedDoc<PersonalUser.PersonalUser> | ObjectId;
	schemaVersion: string;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Schema for UserAppealRequest discriminator.
 * Does not include listing field (only for user account appeals).
 */
const UserAppealRequestSchema = new Schema<
	UserAppealRequest,
	Model<UserAppealRequest>,
	UserAppealRequest
>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: PersonalUser.PersonalUserModelName,
			required: true,
			index: true,
		},
		reason: {
			type: String,
			required: true,
			minlength: 10,
			maxlength: 1000,
		},
		state: {
			type: String,
			enum: APPEAL_REQUEST_STATE_ENUM,
			required: true,
			default: 'requested',
			index: true,
		},
		blocker: {
			type: Schema.Types.ObjectId,
			ref: PersonalUser.PersonalUserModelName,
			required: true,
		},
		schemaVersion: {
			type: String,
			required: true,
			default: '1.0.0',
		},
	},
	appealRequestOptions,
);

const UserAppealRequestModelName: string = 'user-appeal-request';

/**
 * Factory function to create UserAppealRequest discriminator model.
 * @param AppealRequestModel - Base AppealRequest model
 * @returns UserAppealRequest discriminator model
 */
export const UserAppealRequestModelFactory = (
	AppealRequestModel: AppealRequestModelType,
) => {
	return AppealRequestModel.discriminator(
		UserAppealRequestModelName,
		UserAppealRequestSchema,
	);
};

export type UserAppealRequestModelType = ReturnType<
	typeof UserAppealRequestModelFactory
>;
