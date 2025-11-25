import {
	type Model,
	Schema,
	type ObjectId,
	type SchemaDefinition,
	type PopulatedDoc,
} from 'mongoose';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { type User, type UserModelType, userOptions } from './user.model.ts';
import type * as AdminRole from '../role/admin-role.model.ts';
import { Patterns } from '../../patterns.ts';

/**
 * Admin User Account Profile Location interface
 */
export interface AdminUserAccountProfileLocation
	extends MongooseSeedwork.NestedPath {
	address1: string;
	address2: string | null;
	city: string;
	state: string;
	country: string;
	zipCode: string;
}

const AdminUserAccountProfileLocationType: SchemaDefinition<AdminUserAccountProfileLocation> =
	{
		address1: { type: String, required: true },
		address2: { type: String, required: false },
		city: { type: String, required: true },
		state: { type: String, required: true },
		country: { type: String, required: true },
		zipCode: { type: String, required: true },
	};

/**
 * Admin User Account Profile interface
 */
export interface AdminUserAccountProfile extends MongooseSeedwork.NestedPath {
	firstName: string;
	lastName: string;
	aboutMe: string;
	location: AdminUserAccountProfileLocation;
}

const AdminUserAccountProfileType: SchemaDefinition<AdminUserAccountProfile> =
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		aboutMe: { type: String, required: false },
		location: {
			type: AdminUserAccountProfileLocationType,
			required: false,
			...MongooseSeedwork.NestedPathOptions,
		},
	};

/**
 * Admin User Account interface
 */
export interface AdminUserAccount extends MongooseSeedwork.NestedPath {
	accountType: string;
	email: string;
	username: string;
	profile: AdminUserAccountProfile;
}

/**
 * Admin User interface
 */
export interface AdminUser extends User {
	userType: string;
	isBlocked: boolean;
	role?: PopulatedDoc<AdminRole.AdminRole> | ObjectId;
	account: AdminUserAccount;

	schemaVersion: string;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Admin User Account schema definition
 */
const AdminUserAccountType: SchemaDefinition<AdminUserAccount> = {
	accountType: { type: String, required: true, default: 'admin-user' },
	email: {
		type: String,
		match: Patterns.EMAIL_PATTERN,
		maxlength: 254,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	profile: {
		type: AdminUserAccountProfileType,
		required: false,
		...MongooseSeedwork.NestedPathOptions,
	},
};

/**
 * Admin User schema
 */
const AdminUserSchema = new Schema<AdminUser, Model<AdminUser>, AdminUser>(
	{
		isBlocked: { type: Boolean, required: false, default: false },
		role: {
			type: Schema.Types.ObjectId,
			ref: 'Role',
			required: false,
			index: true,
		},
		account: {
			type: AdminUserAccountType,
			required: false,
			...MongooseSeedwork.NestedPathOptions,
		},
		schemaVersion: { type: String, required: true, default: '1.0.0' },
	},
	userOptions,
);

export const AdminUserModelName: string = 'admin-user';

export const AdminUserModelFactory = (UserModel: UserModelType) => {
	return UserModel.discriminator(AdminUserModelName, AdminUserSchema);
};

export type AdminUserModelType = ReturnType<typeof AdminUserModelFactory>;
