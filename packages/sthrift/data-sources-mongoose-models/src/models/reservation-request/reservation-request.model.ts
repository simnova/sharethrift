import type { PopulatedDoc, ObjectId, Model } from 'mongoose';
import { Schema } from 'mongoose';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import * as ItemListing from '../listing/item.model.ts';
import type * as User from '../user/user.model.ts';

export interface ReservationRequest extends MongooseSeedwork.Base {
	state: string;
	reservationPeriodStart: Date;
	reservationPeriodEnd: Date;
	schemaVersion: string;
	listing: PopulatedDoc<ItemListing.ItemListing> | ObjectId;
	reserver: PopulatedDoc<User.User> | ObjectId;
	closeRequestedBySharer: boolean;
	closeRequestedByReserver: boolean;
}

export const ReservationRequestSchema = new Schema<
	ReservationRequest,
	Model<ReservationRequest>,
	ReservationRequest
>(
	{
		state: {
			type: String,
			required: true,
		},
		reservationPeriodStart: { type: Date, required: true },
		reservationPeriodEnd: { type: Date, required: true },
		createdAt: { type: Date, required: true, default: Date.now },
		updatedAt: { type: Date, required: true, default: Date.now },
		schemaVersion: { type: String, required: true, default: '1.0.0' },
		listing: {
			type: Schema.Types.ObjectId,
			ref: ItemListing.ItemListingModelName,
			required: true,
		},
		reserver: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		closeRequestedBySharer: { type: Boolean, required: true, default: false },
		closeRequestedByReserver: { type: Boolean, required: true, default: false },
	},
	{ collection: 'reservationRequests' },
);

export const ReservationRequestModelName: string = 'ReservationRequest';
export const ReservationRequestModelFactory =
	MongooseSeedwork.modelFactory<ReservationRequest>(
		ReservationRequestModelName,
		ReservationRequestSchema,
	);
export type ReservationRequestModelType = ReturnType<
	typeof ReservationRequestModelFactory
>;
