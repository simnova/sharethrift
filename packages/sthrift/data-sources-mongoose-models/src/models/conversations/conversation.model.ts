import { type Model, type ObjectId, Schema, type PopulatedDoc } from 'mongoose';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type * as PersonalUser from '../user/personal-user.model.ts';
import type * as ItemListing from '../listing/item.model.ts';

export interface Conversation extends MongooseSeedwork.Base {
	sharer: PopulatedDoc<PersonalUser.PersonalUser> | ObjectId;
	reserver: PopulatedDoc<PersonalUser.PersonalUser> | ObjectId;
	listing: PopulatedDoc<ItemListing.ItemListing> | ObjectId;
	twilioConversationId: string;
	schemaVersion: string;
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
		schemaVersion: { type: String, required: true, default: '1.0.0' },
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
