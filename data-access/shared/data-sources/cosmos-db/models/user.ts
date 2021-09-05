import { Schema, model, Model } from 'mongoose';

export interface User {
  _id: string;
  schemaVersion: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export const UserModel = model<User>('User', new Schema<User, Model<User>, User>(
  {
    schemaVersion: {
      type: String,
      default: '1.0.0',
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      unique: true,
      required: false,
      index: true,
    }
  },
  {
    timestamps: true, 
    versionKey: true, 
    collection: 'users',
  }
));

