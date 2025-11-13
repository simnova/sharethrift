import type { Models } from '@sthrift/data-sources-mongoose-models';
import { ObjectId } from 'mongodb';

export const adminUsers = [
	{
		_id: '807f1f77bcf86cd799439041',
		userType: 'admin-user',
		isBlocked: false,
		role: new ObjectId('707f1f77bcf86cd799439031'), // Super Admin
		account: {
			accountType: 'admin-user',
			email: 'superadmin@sharethrift.com',
			username: 'superadmin',
			profile: {
				firstName: 'Super',
				lastName: 'Admin',
				location: {
					address1: '',
					address2: '',
					city: '',
					state: '',
					country: '',
					zipCode: '',
				},
			},
		} as Models.User.AdminUserAccount,
		schemaVersion: '1.0.0',
		createdAt: new Date('2023-01-01T08:00:00Z'),
		updatedAt: new Date('2023-01-01T08:00:00Z'),
	},
	{
		_id: '807f1f77bcf86cd799439042',
		userType: 'admin-user',
		isBlocked: false,
		role: new ObjectId('707f1f77bcf86cd799439032'), // Content Moderator
		account: {
			accountType: 'admin-user',
			email: 'moderator@sharethrift.com',
			username: 'contentmod',
			profile: {
				firstName: 'Content',
				lastName: 'Moderator',
				location: {
					address1: '',
					address2: '',
					city: '',
					state: '',
					country: '',
					zipCode: '',
				},
			},
		} as Models.User.AdminUserAccount,
		schemaVersion: '1.0.0',
		createdAt: new Date('2023-01-02T08:00:00Z'),
		updatedAt: new Date('2023-01-02T08:00:00Z'),
	},
	{
		_id: '807f1f77bcf86cd799439043',
		userType: 'admin-user',
		isBlocked: true,
		role: new ObjectId('707f1f77bcf86cd799439033'), // Read Only Admin
		account: {
			accountType: 'admin-user',
			email: 'readonly@sharethrift.com',
			username: 'readonlyadmin',
			profile: {
				firstName: 'Read',
				lastName: 'Only',
				location: {
					address1: '',
					address2: '',
					city: '',
					state: '',
					country: '',
					zipCode: '',
				},
			},
		} as Models.User.AdminUserAccount,
		schemaVersion: '1.0.0',
		createdAt: new Date('2023-01-03T08:00:00Z'),
		updatedAt: new Date('2023-01-03T08:00:00Z'),
	},
	{
		_id: '807f1f77bcf86cd799439044',
		userType: 'admin-user',
		isBlocked: false,
		role: new ObjectId('707f1f77bcf86cd799439031'), // Super Admin
		account: {
			accountType: 'admin-user',
			email: 'nkduy2010+admin@gmail.com', // from mock OAuth2 server (Admin_Email)
			username: 'duynguyen_admin',
			profile: {
				firstName: 'Duy',
				lastName: 'Nguyen',
				location: {
					address1: '1234 Market St',
					address2: 'Suite 100',
					city: 'Philadelphia',
					state: 'PA',
					country: 'USA',
					zipCode: '19107',
				},
			},
		} as Models.User.AdminUserAccount,
		schemaVersion: '1.0.0',
		createdAt: new Date('2023-01-04T08:00:00Z'),
		updatedAt: new Date('2023-01-04T08:00:00Z'),
	},
] as unknown as Models.User.AdminUser[];
