import { Schema, model, Model, PopulatedDoc, ObjectId } from 'mongoose';
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

export interface Role {
  id: ObjectId;
  roleName: string;
  isDefault: boolean;
  permissions: Permissions;
  createdAt:Date;
  updatedAt:Date;
}

export interface Contact {
  id:ObjectId;
  firstName:string;
  lastName?:string;
  role?:Role;
  user?:User.User;
  createdAt:Date;
  updatedAt:Date;
}

export interface Account extends Base {
  name: string;
  contacts: Contact[];
  roles: Role[];
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