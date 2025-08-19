import mongoose, { Schema, type Model, type Document } from 'mongoose';
import type { ObjectId } from 'mongoose';

export interface ReservationRequestDocument extends Document {
	state: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'closing' | 'closed';
	reservationPeriodStart: Date;
	reservationPeriodEnd: Date;
	closeRequested: boolean;
	reason?: string;
	listing: ObjectId; // Listing reference
	reserver: ObjectId; // User reference
	schemaversion: number;
	createdAt: Date;
	updatedAt: Date;
}

const ReservationRequestSchema = new Schema<ReservationRequestDocument, Model<ReservationRequestDocument>>(
	{
		state: {
			type: String,
			enum: ['pending', 'accepted', 'rejected', 'cancelled', 'closing', 'closed'],
			required: true,
			default: 'pending',
		},
		reservationPeriodStart: { type: Date, required: true },
		reservationPeriodEnd: { type: Date, required: true },
		closeRequested: { type: Boolean, required: true, default: false },
		reason: { type: String, required: false },
		listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
		reserver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		schemaversion: { type: Number, required: true, default: 1 },
	},
	{ 
		timestamps: true,
		collection: 'reservation_requests'
	}
);

// Add indexes for common queries
ReservationRequestSchema.index({ reserver: 1, state: 1 });
ReservationRequestSchema.index({ listing: 1, state: 1 });
ReservationRequestSchema.index({ state: 1 });
ReservationRequestSchema.index({ createdAt: -1 });

export const ReservationRequestModelName = 'ReservationRequest';

let ReservationRequestModel: Model<ReservationRequestDocument>;
try {
	ReservationRequestModel = mongoose.model<ReservationRequestDocument>(ReservationRequestModelName);
} catch {
	ReservationRequestModel = mongoose.model<ReservationRequestDocument>(
		ReservationRequestModelName,
		ReservationRequestSchema
	);
}

export { ReservationRequestModel };
export const ReservationRequestCollectionName = 'reservation_requests';