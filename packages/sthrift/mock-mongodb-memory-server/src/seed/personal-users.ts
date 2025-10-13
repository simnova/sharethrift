import type { Models } from '@sthrift/data-sources-mongoose-models';
import { ObjectId } from 'mongodb';

export const personalUsers = [
	{
		_id: '507f1f77bcf86cd799439011',
		userType: 'personal',
		isBlocked: false,
		hasCompletedOnboarding: true,
		role: new ObjectId('607f1f77bcf86cd799439021'),
		account: {
			accountType: 'verified-personal',
			email: 'alice@example.com',
			username: 'alice',
			profile: {
				firstName: 'Alice',
				lastName: 'Smith',
				location: {
					address1: '123 Main St',
					address2: null,
					city: 'Springfield',
					state: 'IL',
					country: 'USA',
					zipCode: '62701',
				} as Models.User.PersonalUserAccountProfileLocation,
				billing: {
					subscriptionId: 'sub_001',
					cybersourceCustomerId: 'cyber_001',
					paymentState: 'SUCCEEDED',
					lastTransactionId: 'txn_001',
					lastPaymentAmount: 100,
				} as Models.User.PersonalUserAccountProfileBilling,
			} as Models.User.PersonalUserAccountProfile,
		} as Models.User.PersonalUserAccount,
		schemaVersion: '1.0.0',
		version: 1,
		discriminatorKey: 'personal-user',
		createdAt: new Date('2023-01-01T10:00:00Z'),
		updatedAt: new Date('2023-01-01T10:00:00Z'),
	},
	{
		_id: '507f1f77bcf86cd799439012',
		userType: 'personal',
		isBlocked: false,
		hasCompletedOnboarding: true,
		role: new ObjectId('607f1f77bcf86cd799439021'),
		account: {
			accountType: 'verified-personal',
			email: 'bob@example.com',
			username: 'bob',
			profile: {
				firstName: 'Bob',
				lastName: 'Johnson',
				location: {
					address1: '456 Oak Ave',
					address2: 'Apt 2',
					city: 'Springfield',
					state: 'IL',
					country: 'USA',
					zipCode: '62701',
				} as Models.User.PersonalUserAccountProfileLocation,
				billing: {
					subscriptionId: 'sub_002',
					cybersourceCustomerId: 'cyber_002',
					paymentState: 'PENDING',
					lastTransactionId: 'txn_002',
					lastPaymentAmount: 50,
				} as Models.User.PersonalUserAccountProfileBilling,
			} as Models.User.PersonalUserAccountProfile,
		} as Models.User.PersonalUserAccount,
		schemaVersion: '1.0.0',
		version: 1,
		discriminatorKey: 'personal-user',
		createdAt: new Date('2023-01-02T11:00:00Z'),
		updatedAt: new Date('2023-01-02T11:00:00Z'),
	},
] as unknown as Models.User.PersonalUser[];
