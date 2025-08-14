import mongoose, { Schema, type Model, type Document } from 'mongoose';
import type { ObjectId } from 'mongoose';

export interface ConversationDocument extends Document {
  sharer: ObjectId; // User reference
  reserver: ObjectId; // User reference
  listing: ObjectId; // Listing reference
  twilioConversationId: string; // Twilio Conversation SID
  schemaversion: number;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<ConversationDocument, Model<ConversationDocument>>(
  {
    sharer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reserver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
    twilioConversationId: { type: String, required: true, unique: true },
    schemaversion: { type: Number, required: true, default: 1 },
  },
  { timestamps: true }
);

export const ConversationModelName = 'Conversation';

let ConversationModel: Model<ConversationDocument>;
try {
  ConversationModel = mongoose.model<ConversationDocument>(ConversationModelName);
} catch {
  ConversationModel = mongoose.model<ConversationDocument>(ConversationModelName, ConversationSchema);
}


// ConversationDocument is already exported above as an interface
export { ConversationModel };
export const ConversationCollectionName = 'Conversation';
