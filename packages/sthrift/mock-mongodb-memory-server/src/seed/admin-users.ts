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
			firstName: 'Super',
			lastName: 'Admin',
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
			firstName: 'Content',
			lastName: 'Moderator',
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
			firstName: 'Read',
			lastName: 'Only',
		} as Models.User.AdminUserAccount,
		schemaVersion: '1.0.0',
		createdAt: new Date('2023-01-03T08:00:00Z'),
		updatedAt: new Date('2023-01-03T08:00:00Z'),
	},
] as unknown as Models.User.AdminUser[];
