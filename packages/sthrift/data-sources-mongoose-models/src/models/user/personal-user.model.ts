import {
	type Model,
	Schema,
	type SchemaDefinition,
} from 'mongoose';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { type User, type UserModelType, userOptions } from './user.model.ts';
import { Patterns } from '../../patterns.ts';

// Location
export interface PersonalUserAccountProfileLocation
	extends MongooseSeedwork.NestedPath {
	address1: string;
	address2: string | null;
	city: string;
	state: string;
	country: string;
	zipCode: string;
}
export const PersonalUserAccountProfileLocationType: SchemaDefinition<PersonalUserAccountProfileLocation> =
	{
		address1: { type: String, required: true },
		address2: { type: String, required: false },
		city: { type: String, required: true },
		state: { type: String, required: true },
		country: { type: String, required: true },
		zipCode: { type: String, required: true },
	};

export const PaymentStateEnum = {
	FAILED: 'FAILED',
	PENDING: 'PENDING',
	REFUNDED: 'REFUNDED',
	SUCCEEDED: 'SUCCEEDED',
} as const;
export type PaymentStateEnum =
	(typeof PaymentStateEnum)[keyof typeof PaymentStateEnum];

export interface PersonalUserAccountProfileBilling
	extends MongooseSeedwork.NestedPath {
	subscriptionId: string;
	cybersourceCustomerId: string;
	paymentState: string;
	lastTransactionId: string;
	lastPaymentAmount: number;
}

export const PersonalUserAccountProfileBillingType: SchemaDefinition<PersonalUserAccountProfileBilling> =
	{
		subscriptionId: { type: String, required: false },
		cybersourceCustomerId: { type: String, required: false },
		paymentState: {
			type: String,
			enum: [
				PaymentStateEnum.FAILED,
				PaymentStateEnum.PENDING,
				PaymentStateEnum.REFUNDED,
				PaymentStateEnum.SUCCEEDED,
			],
			required: false,
		},
		lastTransactionId: { type: String, required: false },
		lastPaymentAmount: { type: Number, required: false },
	};

// Profile
export interface PersonalUserAccountProfile
	extends MongooseSeedwork.NestedPath {
	firstName: string;
	lastName: string;
	aboutMe: string;
	location: PersonalUserAccountProfileLocation;
	billing: PersonalUserAccountProfileBilling;
}
export const PersonalUserAccountProfileType: SchemaDefinition<PersonalUserAccountProfile> =
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		aboutMe: { type: String, required: false },
		location: {
			type: PersonalUserAccountProfileLocationType,
			required: false,
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
export const PersonalUserAccountType: SchemaDefinition<PersonalUserAccount> = {
	accountType: {
		type: String,
		required: false,
		enum: [
			'non-verified-personal',
			'verified-personal',
			'verified-personal-plus',
			'business',
			'enterprise',
		],
	},
	email: {
		type: String,
		match: Patterns.EMAIL_PATTERN,
		maxlength: 254,
		required: true,
	},
	username: {
		type: String,
		required: false,
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
	hasCompletedOnboarding: boolean;

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
		isBlocked: { type: Boolean, required: false, default: false },
		account: {
			type: PersonalUserAccountType,
			required: false,
			...MongooseSeedwork.NestedPathOptions,
		},
		hasCompletedOnboarding: { type: Boolean, required: true, default: false },
		schemaVersion: { type: String, required: true, default: '1.0.0' },
	},
	userOptions,
).index({ 'account.email': 1 }, { sparse: true, unique: true });

export const PersonalUserModelName: string = 'personal-users'; //TODO: This should be in singular form

export const PersonalUserModelFactory = (UserModel: UserModelType) => {
	return UserModel.discriminator(PersonalUserModelName, PersonalUserSchema);
};

export type PersonalUserModelType = ReturnType<typeof PersonalUserModelFactory>;
