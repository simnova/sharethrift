import { Schema, model, Model } from 'mongoose';
import { Base, BaseOptions} from './interfaces/base';

export interface User extends Base {
  externalId: string;
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
    externalId: {
      type: String,
      required: true,
      index: true,
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
    ...BaseOptions 
  }
));