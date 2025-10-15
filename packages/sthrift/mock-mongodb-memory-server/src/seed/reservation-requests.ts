import type { Models } from '@sthrift/data-sources-mongoose-models';
import { ObjectId } from 'mongodb';

export const reservationRequests = [
	{
		_id: '907f1f77bcf86cd799439051',
		state: 'Requested',
		reservationPeriodStart: new Date('2023-04-05T08:00:00Z'),
		reservationPeriodEnd: new Date('2023-04-10T20:00:00Z'),
		schemaVersion: '1.0.0',
		listing: new ObjectId('707f1f77bcf86cd799439031'), // Lawn Mower (Alice's listing)
		reserver: new ObjectId('507f1f77bcf86cd799439012'), // Bob (reserver)
		closeRequestedBySharer: false,
		closeRequestedByReserver: false,
		version: 1,
		discriminatorKey: 'reservation-request',
		createdAt: new Date('2023-04-01T10:00:00Z'),
		updatedAt: new Date('2023-04-01T10:00:00Z'),
	},
	{
		_id: '907f1f77bcf86cd799439052',
		state: 'Accepted',
		reservationPeriodStart: new Date('2023-05-10T08:00:00Z'),
		reservationPeriodEnd: new Date('2023-05-15T20:00:00Z'),
		schemaVersion: '1.0.0',
		listing: new ObjectId('707f1f77bcf86cd799439032'), // Mountain Bike (Bob's listing)
		reserver: new ObjectId('507f1f77bcf86cd799439011'), // Alice (reserver)
		closeRequestedBySharer: false,
		closeRequestedByReserver: false,
		version: 1,
		discriminatorKey: 'reservation-request',
		createdAt: new Date('2023-05-01T10:00:00Z'),
		updatedAt: new Date('2023-05-01T10:00:00Z'),
	},
	{
		_id: '907f1f77bcf86cd799439053',
		state: 'Closed',
		reservationPeriodStart: new Date('2023-03-01T08:00:00Z'),
		reservationPeriodEnd: new Date('2023-03-05T20:00:00Z'),
		schemaVersion: '1.0.0',
		listing: new ObjectId('707f1f77bcf86cd799439031'), // Lawn Mower (Alice's listing)
		reserver: new ObjectId('507f1f77bcf86cd799439012'), // Bob (reserver)
		closeRequestedBySharer: false,
		closeRequestedByReserver: false,
		version: 1,
		discriminatorKey: 'reservation-request',
		createdAt: new Date('2023-02-25T10:00:00Z'),
		updatedAt: new Date('2023-03-06T10:00:00Z'),
	},
] as unknown as Models.ReservationRequest.ReservationRequest[];
