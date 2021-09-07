import { Schema, model, Model } from 'mongoose';

export interface UserType {
  _id: string;
  schemaVersion?: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const UserModel = model<UserType>('User', new Schema<UserType, Model<UserType>, UserType>(
  {
    schemaVersion: {
      type: String,
      default: '1.0.0',
      required: false,
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

