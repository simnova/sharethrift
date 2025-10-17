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

// Constants for email validation
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Admin User Account interface
 * Simpler than PersonalUser - no nested Profile/Location/Billing
 */
export interface AdminUserAccount extends MongooseSeedwork.NestedPath {
	accountType: string;
	email: string;
	username: string;
	firstName: string;
	lastName: string;
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
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
		match: [EMAIL_PATTERN, 'Please provide a valid email address'],
		index: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		index: true,
	},
	firstName: { type: String, required: true, trim: true },
	lastName: { type: String, required: true, trim: true },
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
).index({ 'account.email': 1 }, { sparse: true });

export const AdminUserModelName: string = 'admin-user';

export const AdminUserModelFactory = (UserModel: UserModelType) => {
	return UserModel.discriminator(AdminUserModelName, AdminUserSchema);
};

export type AdminUserModelType = ReturnType<typeof AdminUserModelFactory>;
