import {
	type Model,
	Schema,
	type ObjectId,
	type SchemaDefinition,
	type PopulatedDoc,
	type Types,
} from 'mongoose';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { type User, type UserModelType, userOptions } from './user.model.ts';
import { Patterns } from '../../patterns.ts';
import * as PersonalUserRole from '../role/personal-user-role.model.ts';

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

export const PaymentState = {
	FAILED: 'FAILED',
	PENDING: 'PENDING',
	REFUNDED: 'REFUNDED',
	SUCCEEDED: 'SUCCEEDED',
};

export const SubscriptionStatus = {
	COMPLETED: 'COMPLETED',
	PENDING_REVIEW: 'PENDING_REVIEW',
	DECLINED: 'DECLINED',
	INVALID_REQUEST: 'INVALID_REQUEST',
};
export interface PersonalUserAccountProfileBillingSubscription
	extends MongooseSeedwork.NestedPath {
	subscriptionCode: string;
	planCode: string;
	status: string;
	startDate: Date;
}

export interface PersonalUserAccountProfileBillingTransactions
	extends MongooseSeedwork.SubdocumentBase {
	transactionId: string;
	amount: number;
	referenceId: string;
	status: string;
	completedAt: Date;
	errorMessage: string | null;
}

export interface PersonalUserAccountProfileBilling
	extends MongooseSeedwork.NestedPath {
	cybersourceCustomerId: string;
	subscription: PersonalUserAccountProfileBillingSubscription;
	transactions: Types.DocumentArray<PersonalUserAccountProfileBillingTransactions>;
}

export const PersonalUserAccountProfileBillingSubscriptionType: SchemaDefinition<PersonalUserAccountProfileBillingSubscription> =
	{
		subscriptionCode: { type: String, required: true },
		planCode: { type: String, required: true },
		status: {
			type: String,
			required: true,
			enum: [
				SubscriptionStatus.COMPLETED,
				SubscriptionStatus.PENDING_REVIEW,
				SubscriptionStatus.DECLINED,
				SubscriptionStatus.INVALID_REQUEST,
			],
		},
		startDate: { type: Date, required: true, default: Date.now },
	};

export const PersonalUserAccountProfileBillingTransactionsSchema = new Schema<
	PersonalUserAccountProfileBillingTransactions,
	Model<PersonalUserAccountProfileBillingTransactions>,
	PersonalUserAccountProfileBillingTransactions
>({
	transactionId: { type: String, required: true },
	amount: { type: Number, required: true },
	referenceId: { type: String, required: true },
	status: {
		type: String,
		required: true,
		enum: [
			PaymentState.FAILED,
			PaymentState.PENDING,
			PaymentState.REFUNDED,
			PaymentState.SUCCEEDED,
		],
	},
	completedAt: { type: Date, required: false },
	errorMessage: { type: String, required: false },
});
export const PersonalUserAccountProfileBillingType: SchemaDefinition<PersonalUserAccountProfileBilling> =
	{
		cybersourceCustomerId: { type: String, required: false },
		subscription: {
			type: PersonalUserAccountProfileBillingSubscriptionType,
			required: false,
			...MongooseSeedwork.NestedPathOptions,
		},
		transactions: {
			type: [PersonalUserAccountProfileBillingTransactionsSchema],
			required: false,
		},
	};

// Profile
export interface PersonalUserAccountProfile
	extends MongooseSeedwork.NestedPath {
	firstName: string;
	lastName: string;
	location: PersonalUserAccountProfileLocation;
	billing: PersonalUserAccountProfileBilling;
}
export const PersonalUserAccountProfileType: SchemaDefinition<PersonalUserAccountProfile> =
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
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
		unique: true,
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
	role?: PopulatedDoc<PersonalUserRole.PersonalUserRole> | ObjectId;
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
		role: {
			type: Schema.Types.ObjectId,
			ref: PersonalUserRole.PersonalUserRoleModelName,
			required: false,
			index: true,
		},
		account: {
			type: PersonalUserAccountType,
			required: false,
			...MongooseSeedwork.NestedPathOptions,
		},
		hasCompletedOnboarding: { type: Boolean, required: true, default: false },
		schemaVersion: { type: String, required: true, default: '1.0.0' },
	},
	userOptions,
).index({ 'account.email': 1 }, { sparse: true });

export const PersonalUserModelName: string = 'personal-users'; //TODO: This should be in singular form

export const PersonalUserModelFactory = (UserModel: UserModelType) => {
	return UserModel.discriminator(PersonalUserModelName, PersonalUserSchema);
};

export type PersonalUserModelType = ReturnType<typeof PersonalUserModelFactory>;
