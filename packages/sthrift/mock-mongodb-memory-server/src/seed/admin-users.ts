import type { Models } from '@sthrift/data-sources-mongoose-models';
import { ObjectId } from 'mongodb';

const createAdminUser = (options: {
	id: string;
	isBlocked: boolean;
	roleId: string;
	email: string;
	username: string;
	firstName: string;
	lastName: string;
	createdDate: string;
	location?: {
		address1: string;
		address2: string;
		city: string;
		state: string;
		country: string;
		zipCode: string;
	};
}) => ({
	_id: options.id,
	userType: 'admin-user',
	isBlocked: options.isBlocked,
	role: new ObjectId(options.roleId),
	account: {
		accountType: 'admin-user',
		email: options.email,
		username: options.username,
		profile: {
			firstName: options.firstName,
			lastName: options.lastName,
			location: options.location || {
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
	createdAt: new Date(options.createdDate),
	updatedAt: new Date(options.createdDate),
});

export const adminUsers = [
	createAdminUser({
		id: '807f1f77bcf86cd799439041',
		isBlocked: false,
		roleId: '707f1f77bcf86cd799439031', // Super Admin
		email: 'superadmin@sharethrift.com',
		username: 'superadmin',
		firstName: 'Super',
		lastName: 'Admin',
		createdDate: '2023-01-01T08:00:00Z',
	}),
	createAdminUser({
		id: '807f1f77bcf86cd799439042',
		isBlocked: false,
		roleId: '707f1f77bcf86cd799439032', // Content Moderator
		email: 'moderator@sharethrift.com',
		username: 'contentmod',
		firstName: 'Content',
		lastName: 'Moderator',
		createdDate: '2023-01-02T08:00:00Z',
	}),
	createAdminUser({
		id: '807f1f77bcf86cd799439043',
		isBlocked: true,
		roleId: '707f1f77bcf86cd799439033', // Read Only Admin
		email: 'readonly@sharethrift.com',
		username: 'readonlyadmin',
		firstName: 'Read',
		lastName: 'Only',
		createdDate: '2023-01-03T08:00:00Z',
	}),
	createAdminUser({
		id: '807f1f77bcf86cd799439044',
		isBlocked: false,
		roleId: '707f1f77bcf86cd799439031', // Super Admin
		email: 'nkduy2010+admin@gmail.com',
		username: 'duynguyen_admin',
		firstName: 'Duy',
		lastName: 'Nguyen',
		createdDate: '2023-01-04T08:00:00Z',
		location: {
			address1: '1234 Market St',
			address2: 'Suite 100',
			city: 'Philadelphia',
			state: 'PA',
			country: 'USA',
			zipCode: '19107',
		},
	}),
] as unknown as Models.User.AdminUser[];
