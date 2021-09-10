import { Schema, model, Model, Document } from 'mongoose';

/**
 * This _should not_ extend document, but because of this issue we're stuck: https://github.com/GraphQLGuide/apollo-datasource-mongodb/issues/78
 * 
 * Can also change type to "any" in the data source but loose type safety
 */
export interface User extends Document {
  _id: string;
  schemaVersion?: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
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
    versionKey: true, 
    collection: 'users',
  }
));

export type UserModelType = typeof UserModel;