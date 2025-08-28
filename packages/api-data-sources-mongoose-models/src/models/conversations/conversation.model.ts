import { type Model, type ObjectId, Schema } from 'mongoose';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';

export interface Conversation extends MongooseSeedwork.Base {
	sharer: ObjectId;
	reserver: ObjectId;
	listing: ObjectId;
	twilioConversationId: string;
	schemaversion: number;
	createdAt: Date;
	updatedAt: Date;
}

const ConversationSchema = new Schema<
	Conversation,
	Model<Conversation>,
	Conversation
>(
	{
		sharer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		reserver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
		twilioConversationId: { type: String, required: true, unique: true },
		schemaversion: { type: Number, required: true, default: 1 },
		createdAt: { type: Date, required: true, default: Date.now },
		updatedAt: { type: Date, required: true, default: Date.now },
	},
	{ timestamps: true },
);

export const ConversationModelName = 'Conversation';
export const ConversationModelFactory =
	MongooseSeedwork.modelFactory<Conversation>(
		ConversationModelName,
		ConversationSchema,
	);
export type ConversationModelType = ReturnType<typeof ConversationModelFactory>;
