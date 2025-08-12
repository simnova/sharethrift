import { Schema } from 'mongoose';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';

export const ReservationRequestSchema = new Schema({
	state: {
		type: String,
		enum: ['Requested', 'Accepted', 'Rejected', 'Reservation Period', 'Cancelled'],
		required: true,
	},
	reservationPeriodStart: { type: Date, required: true },
	reservationPeriodEnd: { type: Date, required: true },
	createdAt: { type: Date, required: true, default: Date.now },
	updatedAt: { type: Date, required: true, default: Date.now },
	schemaversion: { type: Number, required: true },
	listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
	reserver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	closeRequested: { type: Boolean, required: true, default: false },
}, { collection: 'reservation_requests' });

export const createReservationRequestModel = MongooseSeedwork.modelFactory(
	'ReservationRequest',
	ReservationRequestSchema,
);