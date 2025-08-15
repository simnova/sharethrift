import { Schema } from 'mongoose';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';

/**
 * Location nested path schema
 */
export interface LocationModel {
	address1: string;
	address2?: string;
	city: string;
	state: string;
	country: string;
	zipCode: string;
}

const LocationSchema = new Schema<LocationModel>({
	address1: { type: String, required: true },
	address2: { type: String, required: false },
	city: { type: String, required: true },
	state: { type: String, required: true },
	country: { type: String, required: true },
	zipCode: { type: String, required: true }
}, { _id: false });

/**
 * Billing nested path schema
 */
export interface BillingModel {
	subscriptionId?: string;
	cybersourceCustomerId?: string;
}

const BillingSchema = new Schema<BillingModel>({
	subscriptionId: { type: String, required: false },
	cybersourceCustomerId: { type: String, required: false }
}, { _id: false });

/**
 * Profile nested path schema
 */
export interface ProfileModel {
	firstName: string;
	lastName: string;
	location: LocationModel;
	billing?: BillingModel;
}

const ProfileSchema = new Schema<ProfileModel>({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	location: { type: LocationSchema, required: true },
	billing: { type: BillingSchema, required: false }
}, { _id: false });

/**
 * Account nested path schema
 */
export interface AccountModel {
	accountType: string;
	email: string;
	username: string;
	profile: ProfileModel;
}

const AccountSchema = new Schema<AccountModel>({
	accountType: { 
		type: String, 
		required: true,
		enum: ['personal', 'business', 'enterprise']
	},
	email: { 
		type: String, 
		required: true,
		unique: true,
		index: true
	},
	username: { 
		type: String, 
		required: true,
		unique: true,
		index: true
	},
	profile: { type: ProfileSchema, required: true }
}, { _id: false });

/**
 * User document interface extending Base
 */
export interface UserModel extends MongooseSeedwork.Base {
	userType: string;
	isBlocked: boolean;
	account: AccountModel;
}

/**
 * User mongoose schema
 */
const UserSchema = new Schema<UserModel>({
	userType: {
		type: String,
		required: true,
		enum: ['personal', 'admin']
	},
	isBlocked: {
		type: Boolean,
		required: true,
		default: false
	},
	account: { type: AccountSchema, required: true }
}, {
	timestamps: true,
	versionKey: 'version',
	collection: 'users'
});

// Indexes for efficient queries
UserSchema.index({ 'account.email': 1 }, { unique: true });
UserSchema.index({ 'account.username': 1 }, { unique: true });
UserSchema.index({ userType: 1 });
UserSchema.index({ isBlocked: 1 });
UserSchema.index({ createdAt: 1 });

/**
 * User model factory function
 */
export const UserModelFactory = (mongooseContext: MongooseSeedwork.MongooseContextFactory) => {
	return mongooseContext.service.model('User', UserSchema);
};