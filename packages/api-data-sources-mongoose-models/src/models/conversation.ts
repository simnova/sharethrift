import { Schema, model, Types, Document } from 'mongoose';

export interface ConversationDocument extends Document {
  participants: Types.ObjectId[]; // User IDs
  lastMessage?: Types.ObjectId; // Message ID
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<ConversationDocument>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
  },
  { timestamps: true }
);

export const ConversationModel = model<ConversationDocument>('Conversation', ConversationSchema);
