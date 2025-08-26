import type { PopulatedDoc, ObjectId, Model } from 'mongoose';
import { Schema } from 'mongoose';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';

export interface ReservationRequest extends MongooseSeedwork.Base {
	state: string;
	reservationPeriodStart: Date;
	reservationPeriodEnd: Date;
	schemaVersion: string; // changed from number to string
	listing: PopulatedDoc<unknown> | ObjectId; // Replace 'unknown' with Listing type when available
	reserver: PopulatedDoc<unknown> | ObjectId; // Replace 'unknown' with User type when available
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
	schemaVersion: { type: String, required: true }, // changed from Number to String
	listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
	reserver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	closeRequested: { type: Boolean, required: true, default: false },
}, { collection: 'reservation_requests' });


export const ReservationRequestModelName: string = 'ReservationRequest';
export const ReservationRequestModelFactory = MongooseSeedwork.modelFactory<ReservationRequest>(
	ReservationRequestModelName,
	ReservationRequestSchema,
);
export type ReservationRequestModelType = ReturnType<typeof ReservationRequestModelFactory>;


