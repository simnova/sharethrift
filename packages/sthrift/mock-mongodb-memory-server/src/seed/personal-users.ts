import type { Models } from '@sthrift/data-sources-mongoose-models';

// Extracted repeated address and billing objects to avoid duplicated blocks
const addressSpringfieldIL = {
	address1: '123 Main St',
	address2: null,
	city: 'Springfield',
	state: 'IL',
	country: 'USA',
	zipCode: '62701',
} as Models.User.PersonalUserAccountProfileLocation;

const addressOakAveIL = {
	address1: '456 Oak Ave',
	address2: 'Apt 2',
	city: 'Springfield',
	state: 'IL',
	country: 'USA',
	zipCode: '62701',
} as Models.User.PersonalUserAccountProfileLocation;

const addressPineRdPA = {
	address1: '789 Pine Rd',
	address2: null,
	city: 'Philadelphia',
	state: 'PA',
	country: 'USA',
	zipCode: '19101',
} as Models.User.PersonalUserAccountProfileLocation;

const billingAlice = {
	cybersourceCustomerId: 'cust_123456780',
	subscription: {
		subscriptionId: 'sub_987654322',
		planCode: 'basic-plan',
		status: 'ACTIVE',
		startDate: new Date('2023-02-01T10:00:00Z'),
	},
} as Models.User.PersonalUserAccountProfileBilling;

const billingBob = {
	cybersourceCustomerId: 'cust_123456789',
	subscription: {
		subscriptionId: 'sub_987654321',
		planCode: 'verified-personal',
		status: 'ACTIVE',
		startDate: new Date('2023-02-01T10:00:00Z'),
	},
} as Models.User.PersonalUserAccountProfileBilling;

const billingCharlie = {
	cybersourceCustomerId: 'cust_123456780',
	subscription: {
		subscriptionId: 'sub_987654321',
		planCode: 'non-verified-personal',
		status: 'ACTIVE',
		startDate: new Date('2023-02-01T10:00:00Z'),
	},
} as Models.User.PersonalUserAccountProfileBilling;

export const personalUsers: Models.User.PersonalUser[] = [
	{
		_id: '507f1f77bcf86cd799439011',
		userType: 'personal-users',
		isBlocked: false,
		hasCompletedOnboarding: true,
		account: {
			accountType: 'verified-personal',
			email: 'alice@example.com',
			username: 'alice',
			profile: {
				firstName: 'Alice',
				lastName: 'Smith',
				aboutMe: 'Hello',
				location: addressSpringfieldIL,
				billing: billingAlice,
			} as Models.User.PersonalUserAccountProfile,
		} as Models.User.PersonalUserAccount,
		schemaVersion: '1.0.0',
		version: 1,

		createdAt: new Date('2023-01-01T10:00:00Z'),
		updatedAt: new Date('2023-01-01T10:00:00Z'),
	},
	{
		_id: '507f1f77bcf86cd799439012',
		userType: 'personal-users',
		isBlocked: false,
		hasCompletedOnboarding: true,
		account: {
			accountType: 'verified-personal',
			email: 'bob@example.com',
			username: 'bob',
			profile: {
				firstName: 'Bob',
				lastName: 'Johnson',
				aboutMe: 'Hello',
				location: addressOakAveIL,
				billing: billingBob,
			} as Models.User.PersonalUserAccountProfile,
		} as Models.User.PersonalUserAccount,
		schemaVersion: '1.0.0',
		version: 1,

		createdAt: new Date('2023-01-02T11:00:00Z'),
		updatedAt: new Date('2023-01-02T11:00:00Z'),
	},
	{
		_id: '507f1f77bcf86cd799439013',
		userType: 'personal-users',
		isBlocked: false,
		hasCompletedOnboarding: true,
		account: {
			accountType: 'verified-personal',
			email: 'charlie@example.com',
			username: 'charlie',
			profile: {
				firstName: 'Charlie',
				lastName: 'Brown',
				location: addressPineRdPA,
				billing: billingCharlie,
			} as Models.User.PersonalUserAccountProfile,
		} as Models.User.PersonalUserAccount,
		schemaVersion: '1.0.0',
		version: 1,
		createdAt: new Date('2023-01-03T12:00:00Z'),
		updatedAt: new Date('2023-01-03T12:00:00Z'),
	},
	{
		_id: '507f1f77bcf86cd799439014',
		userType: 'personal-users',
		isBlocked: false,
		hasCompletedOnboarding: false,
		account: {
			accountType: 'verified-personal',
			email: 'nkduy2010@gmail.com',
			username: 'duynguyen',
			profile: {
				firstName: 'Duy',
				lastName: 'Nguyen',
				location: addressPineRdPA,
			} as Models.User.PersonalUserAccountProfile,
		} as Models.User.PersonalUserAccount,
		schemaVersion: '1.0.0',
		version: 1,
		createdAt: new Date('2023-01-03T12:00:00Z'),
		updatedAt: new Date('2023-01-03T12:00:00Z'),
	},
] as unknown as Models.User.PersonalUser[];
