import mongoose, { Schema, model, Model, ObjectId, Document,PopulatedDoc } from 'mongoose';

import { Base, BaseOptions } from './interfaces/base';
import * as User from "./user";

export interface ListingPermissions {
  id: ObjectId;
  canManageListings: boolean;
}
export interface AccountPermissions {
  id: ObjectId;
  canManageRolesAndPermissions: boolean;
}
export interface Permissions {
  id: ObjectId;
  listingPermissions: ListingPermissions;
  accountPermissions: AccountPermissions;
}

export interface Role extends Document {
  id: ObjectId;
  roleName: string;
  isDefault: boolean;
  permissions: Permissions;
  createdAt:Date;
  updatedAt:Date;
}

export interface Contact extends Document {
  id:ObjectId;
  firstName:string;
  lastName?:string;
  role?:Role;

  user:PopulatedDoc<User.User> | ObjectId;
  createdAt:Date;
  updatedAt:Date;
}

export interface Account extends Base {
  name: string;
  contacts: mongoose.Types.DocumentArray<Contact>
  roles: mongoose.Types.DocumentArray<Role>;
}

export const AccountModel = model<Account>('Account',new Schema<Account, Model<Account>, Account>(
  {
    schemaVersion: { type: String, default: '1.0.0' },
    name: { type: String, required: true, unique: true, index: true },
    contacts: [{
      firstName: { type: String, required: true },
      lastName: { type: String, required: false },
      role: { type: Schema.Types.ObjectId, ref: 'Role', required: false },
      user: { type: Schema.Types.ObjectId, ref: User.UserModel.modelName, required: false },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }],
    roles: [{
      roleName: { type: String, required: true },
      isDefault: { type: Boolean, required: true },
      permissions: {
        listingPermissions: {
          canManageListings: { type: Boolean, required: true }
        },
        accountPermissions: {
          canManageRolesAndPermissions: { type: Boolean, required: true }
        }
      },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }]
  },
  {
    ...BaseOptions,
  }
));