import { type Model, Schema } from 'mongoose';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { type User, type UserModelType, userOptions } from './user.model.ts';
import { Patterns } from '../../patterns.ts';

// Location
export interface PersonalUserAccountProfileLocation
	extends MongooseSeedwork.NestedPath {
	address1: string;
	address2?: string;
	city: string;
	state: string;
	country: string;
	zipCode: string;
}
export const PersonalUserAccountProfileLocationType = {
	address1: { type: String, required: true },
	address2: { type: String, required: false },
	city: { type: String, required: true },
	state: { type: String, required: true },
	country: { type: String, required: true },
	zipCode: { type: String, required: true },
};

// Billing
export interface PersonalUserAccountProfileBilling
	extends MongooseSeedwork.NestedPath {
	subscriptionId?: string;
	cybersourceCustomerId?: string;
}
export const PersonalUserAccountProfileBillingType = {
	subscriptionId: { type: String, required: false },
	cybersourceCustomerId: { type: String, required: false },
};

// Profile
export interface PersonalUserAccountProfile
	extends MongooseSeedwork.NestedPath {
	firstName: string;
	lastName: string;
	location: PersonalUserAccountProfileLocation;
	billing: PersonalUserAccountProfileBilling;
}
export const PersonalUserAccountProfileType = {
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	location: {
		type: PersonalUserAccountProfileLocationType,
		required: true,
		...MongooseSeedwork.NestedPathOptions,
	},
	billing: {
		type: PersonalUserAccountProfileBillingType,
		required: false,
		...MongooseSeedwork.NestedPathOptions,
	},
};

// Account
export interface PersonalUserAccount extends MongooseSeedwork.NestedPath {
	accountType: string;
	email: string;
	username: string;
	profile: PersonalUserAccountProfile;
}
export const PersonalUserAccountType = {
	accountType: {
		type: String,
		required: true,
		enum: ['personal', 'business', 'enterprise'],
	},
	email: {
		type: String,
		match: Patterns.EMAIL_PATTERN,
		maxlength: 254,
		required: true,
		unique: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
	},
	profile: {
		type: PersonalUserAccountProfileType,
		required: true,
		...MongooseSeedwork.NestedPathOptions,
	},
};

export interface PersonalUser extends User {
	userType: string;
	isBlocked: boolean;
	account: PersonalUserAccount;
	schemaVersion: string;
	createdAt: Date;
	updatedAt: Date;
}

const PersonalUserSchema = new Schema<
	PersonalUser,
	Model<PersonalUser>,
	PersonalUser
>(
	{
		userType: { type: String, required: true },
		isBlocked: { type: Boolean, required: true },
		account: {
			type: PersonalUserAccountType,
			required: true,
			...MongooseSeedwork.NestedPathOptions,
		},
		schemaVersion: { type: String, required: true, default: '1.0.0' },
	},
	userOptions,
).index({ 'account.email': 1 }, { sparse: true });

export const PersonalUserModelName: string = 'personal-users'; //TODO: This should be in singular form

export const PersonalUserModelFactory = (UserModel: UserModelType) => {
	return UserModel.discriminator(PersonalUserModelName, PersonalUserSchema);
};

export type PersonalUserModelType = ReturnType<typeof PersonalUserModelFactory>;
