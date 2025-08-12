import { Schema, model, Types, Document } from 'mongoose';

export interface MessageDocument extends Document {
  conversation: Types.ObjectId; // Conversation ID
  sender: Types.ObjectId; // User ID
  content: string;
  readBy: Types.ObjectId[]; // User IDs who have read the message
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<MessageDocument>(
  {
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const MessageModel = model<MessageDocument>('Message', MessageSchema);
