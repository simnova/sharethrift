import type { Models } from '@sthrift/data-sources-mongoose-models';
import { ObjectId } from 'mongodb';

export const listingAppealRequests = [
	{
		_id: '907f1f77bcf86cd799439051',
		type: 'listing',
		user: new ObjectId('507f1f77bcf86cd799439012'),
		listing: new ObjectId('707f1f77bcf86cd799439031'),
		reason:
			'I was blocked from this listing unfairly. I have been a responsible borrower and would like to appeal this decision.',
		state: 'requested',
		blocker: new ObjectId('507f1f77bcf86cd799439011'),
		createdAt: new Date('2023-04-10T14:30:00Z'),
		updatedAt: new Date('2023-04-10T14:30:00Z'),
		schemaVersion: '1.0.0',
		version: 1,
	},
	{
		_id: '907f1f77bcf86cd799439052',
		type: 'listing',
		user: new ObjectId('507f1f77bcf86cd799439013'),
		listing: new ObjectId('707f1f77bcf86cd799439032'),
		reason:
			'I believe I was blocked by mistake. I have always returned items on time and in good condition.',
		state: 'accepted',
		blocker: new ObjectId('507f1f77bcf86cd799439012'),
		createdAt: new Date('2023-05-05T09:15:00Z'),
		updatedAt: new Date('2023-05-06T11:00:00Z'),
		schemaVersion: '1.0.0',
		version: 1,
	},
	{
		_id: '907f1f77bcf86cd799439053',
		type: 'listing',
		user: new ObjectId('507f1f77bcf86cd799439014'),
		listing: new ObjectId('707f1f77bcf86cd799439033'),
		reason:
			'The block was issued due to a misunderstanding about the return date.',
		state: 'denied',
		blocker: new ObjectId('507f1f77bcf86cd799439011'),
		createdAt: new Date('2023-06-01T16:45:00Z'),
		updatedAt: new Date('2023-06-02T10:20:00Z'),
		schemaVersion: '1.0.0',
		version: 1,
	},
] as unknown as Models.AppealRequest.ListingAppealRequest[];
