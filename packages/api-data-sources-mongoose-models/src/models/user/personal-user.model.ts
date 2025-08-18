import { type Model, Schema } from 'mongoose';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { type User, type UserModelType, userOptions } from './user.model.ts';
import { Patterns } from '../../patterns.ts';

// Location
export interface PersonalUserLocation extends MongooseSeedwork.NestedPath {
	address1: string;
	address2?: string;
	city: string;
	state: string;
	country: string;
	zipCode: string;
}
export const PersonalUserLocationType = {
	address1: { type: String, required: true },
	address2: { type: String, required: false },
	city: { type: String, required: true },
	state: { type: String, required: true },
	country: { type: String, required: true },
	zipCode: { type: String, required: true },
};

// Billing
export interface PersonalUserBilling extends MongooseSeedwork.NestedPath {
	subscriptionId?: string;
	cybersourceCustomerId?: string;
}
export const PersonalUserBillingType = {
	subscriptionId: { type: String, required: false },
	cybersourceCustomerId: { type: String, required: false },
};

// Profile
export interface PersonalUserProfile extends MongooseSeedwork.NestedPath {
	firstName: string;
	lastName: string;
	location: PersonalUserLocation;
	billing?: PersonalUserBilling;
}
export const PersonalUserProfileType = {
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	location: {
		type: PersonalUserLocationType,
		required: true,
		...MongooseSeedwork.NestedPathOptions,
	},
	billing: {
		type: PersonalUserBillingType,
		required: false,
		...MongooseSeedwork.NestedPathOptions,
	},
};

// Account
export interface PersonalUserAccount extends MongooseSeedwork.NestedPath {
	accountType: string;
	email: string;
	username: string;
	profile: PersonalUserProfile;
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
		index: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
	},
	profile: {
		type: PersonalUserProfileType,
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
);

PersonalUserSchema.index({ 'account.email': 1 }, { sparse: true });

export const PersonalUserModelName: string = 'personal-users'; //TODO: This should be in singular form

export const PersonalUserModelFactory = (UserModel: UserModelType) => {
	return UserModel.discriminator(PersonalUserModelName, PersonalUserSchema);
};

export type PersonalUserModelType = ReturnType<typeof PersonalUserModelFactory>;
