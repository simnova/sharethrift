import { Schema, model, Model } from 'mongoose';
import { Base } from './base';

export interface User extends Base {
  firstName: string;
  lastName: string;
  email: string;
}

export const UserModel = model<User>('User', new Schema<User, Model<User>, User>(
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
    versionKey: 'version', 
  }
));

export type UserModelType = typeof UserModel;