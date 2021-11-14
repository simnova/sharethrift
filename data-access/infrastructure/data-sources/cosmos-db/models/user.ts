import { Schema, model, Model } from 'mongoose';
import { Base, BaseOptions } from './interfaces/base';

export interface User extends Base {
  externalId: string;
  firstName: string;
  lastName: string;
  email: string;
}

const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const GUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const UserModel = model<User>('User', new Schema<User, Model<User>, User>(
  {
    schemaVersion: {
      type: String,
      default: '1.0.0',
      required: false,
    },
    externalId: {
      type: String,
      match: GUID_PATTERN,
      minlength: [36, 'External ID must be 36 characters long'],
      maxlength: [36, 'External ID must be 36 characters long'],
      required: true,
      index: true,
    },
    firstName: {
      type: String,
      required: false,
      maxlength: 500,
    },
    lastName: {
      type: String,
      required: false,
      maxlength: 500,
    },
    email: {
      type: String,
      match: EMAIL_PATTERN,
      maxlength: 254,
      unique: true,
      required: false,
      index: true,
    }
  },
  {
    ...BaseOptions 
  }
));