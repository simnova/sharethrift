import type { PopulatedDoc, ObjectId, Model } from 'mongoose';
import { Schema } from 'mongoose';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import * as ItemListing from '../listing/item-model.ts'
import * as PersonalUser from '../user/personal-user.model.ts'

export interface ReservationRequest extends MongooseSeedwork.Base {
	state: string;
	reservationPeriodStart: Date;
	reservationPeriodEnd: Date;
	schemaVersion: string;
	listing: PopulatedDoc<ItemListing.ItemListing> | ObjectId;
	reserver: PopulatedDoc<PersonalUser.PersonalUser> | ObjectId;
	closeRequested: boolean;
}

export const ReservationRequestSchema = new Schema<ReservationRequest, Model<ReservationRequest>, ReservationRequest>({
	state: {
		type: String,
		required: true,
	},
	reservationPeriodStart: { type: Date, required: true },
	reservationPeriodEnd: { type: Date, required: true },
	createdAt: { type: Date, required: true, default: Date.now },
	updatedAt: { type: Date, required: true, default: Date.now },
	schemaVersion: { type: String, required: true, default: '1.0.0' },
	listing: { type: Schema.Types.ObjectId, ref: ItemListing.ItemListingModelName, required: true },
	reserver: { type: Schema.Types.ObjectId, ref: PersonalUser.PersonalUserModelName, required: true },
	closeRequested: { type: Boolean, required: true, default: false },
}, { collection: 'reservation_requests' });


export const ReservationRequestModelName: string = 'ReservationRequest';
export const ReservationRequestModelFactory = MongooseSeedwork.modelFactory<ReservationRequest>(
	ReservationRequestModelName,
	ReservationRequestSchema,
);
export type ReservationRequestModelType = ReturnType<typeof ReservationRequestModelFactory>;


