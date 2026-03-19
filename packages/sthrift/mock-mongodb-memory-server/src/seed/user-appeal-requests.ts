import type { Models } from '@sthrift/data-sources-mongoose-models';
import { ObjectId } from 'mongodb';

export const userAppealRequests = [
	{
		_id: '907f1f77bcf86cd799439054',
		type: 'user',
		user: new ObjectId('507f1f77bcf86cd799439012'),
		reason:
			'I was blocked from interacting with this user entirely, but I believe this was due to a single miscommunication.',
		state: 'requested',
		blocker: new ObjectId('507f1f77bcf86cd799439013'),
		createdAt: new Date('2023-04-15T12:00:00Z'),
		updatedAt: new Date('2023-04-15T12:00:00Z'),
		schemaVersion: '1.0.0',
		version: 1,
	},
	{
		_id: '907f1f77bcf86cd799439055',
		type: 'user',
		user: new ObjectId('507f1f77bcf86cd799439011'),
		reason:
			'I am appealing the user block as I believe it was issued in error.',
		state: 'accepted',
		blocker: new ObjectId('507f1f77bcf86cd799439012'),
		createdAt: new Date('2023-05-20T08:30:00Z'),
		updatedAt: new Date('2023-05-21T14:15:00Z'),
		schemaVersion: '1.0.0',
		version: 1,
	},
	{
		_id: '907f1f77bcf86cd799439056',
		type: 'user',
		user: new ObjectId('507f1f77bcf86cd799439013'),
		reason:
			'This user block prevents me from accessing multiple listings. The original issue was minor.',
		state: 'denied',
		blocker: new ObjectId('507f1f77bcf86cd799439011'),
		createdAt: new Date('2023-06-10T15:00:00Z'),
		updatedAt: new Date('2023-06-11T09:30:00Z'),
		schemaVersion: '1.0.0',
		version: 1,
	},
] as unknown as Models.AppealRequest.UserAppealRequest[];
