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
import * as ItemListing from '../listing/item.model.ts';

/**
 * Interface for ListingAppealRequest discriminator.
 * Represents an appeal request for a blocked listing.
 */
export interface ListingAppealRequest extends AppealRequest {
	user: PopulatedDoc<PersonalUser.PersonalUser> | ObjectId;
	listing: PopulatedDoc<ItemListing.ItemListing> | ObjectId;
	reason: string;
	state: 'requested' | 'denied' | 'accepted';
	blocker: PopulatedDoc<PersonalUser.PersonalUser> | ObjectId;
	schemaVersion: string;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Valid states for appeal requests
 */
export const APPEAL_REQUEST_STATE_ENUM = [
	'requested',
	'denied',
	'accepted',
] as const;

/**
 * Schema for ListingAppealRequest discriminator.
 * Adds listing field to base appeal request schema.
 */
const ListingAppealRequestSchema = new Schema<
	ListingAppealRequest,
	Model<ListingAppealRequest>,
	ListingAppealRequest
>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: PersonalUser.PersonalUserModelName,
			required: true,
			index: true,
		},
		listing: {
			type: Schema.Types.ObjectId,
			ref: ItemListing.ItemListingModelName,
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

const ListingAppealRequestModelName: string = 'listing-appeal-request';

/**
 * Factory function to create ListingAppealRequest discriminator model.
 * @param AppealRequestModel - Base AppealRequest model
 * @returns ListingAppealRequest discriminator model
 */
export const ListingAppealRequestModelFactory = (
	AppealRequestModel: AppealRequestModelType,
) => {
	return AppealRequestModel.discriminator(
		ListingAppealRequestModelName,
		ListingAppealRequestSchema,
	);
};

export type ListingAppealRequestModelType = ReturnType<
	typeof ListingAppealRequestModelFactory
>;
