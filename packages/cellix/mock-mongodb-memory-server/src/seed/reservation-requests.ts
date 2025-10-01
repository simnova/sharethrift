import type { Models } from '@sthrift/data-sources-mongoose-models';
import { ObjectId } from 'mongodb';

type PlainReservationRequest = Omit<
	Models.ReservationRequest.ReservationRequest,
	keyof import('mongoose').Document
> & { _id: string; discriminatorKey: string };

export const reservationRequests: PlainReservationRequest[] = [
	{
		_id: '907f1f77bcf86cd799439051',
		state: 'Pending',
		reservationPeriodStart: new Date('2023-04-05T08:00:00Z'),
		reservationPeriodEnd: new Date('2023-04-10T20:00:00Z'),
		schemaVersion: '1.0.0',
		listing: new ObjectId('707f1f77bcf86cd799439031'), // Lawn Mower
		reserver: new ObjectId('507f1f77bcf86cd799439012'), // Bob
		closeRequestedBySharer: false,
		closeRequestedByReserver: false,
		version: 1,
		discriminatorKey: 'reservation-request',
		createdAt: new Date('2023-04-01T10:00:00Z'),
		updatedAt: new Date('2023-04-01T10:00:00Z'),
	},
	{
		_id: '907f1f77bcf86cd799439052',
		state: 'Approved',
		reservationPeriodStart: new Date('2023-05-10T08:00:00Z'),
		reservationPeriodEnd: new Date('2023-05-15T20:00:00Z'),
		schemaVersion: '1.0.0',
		listing: new ObjectId('707f1f77bcf86cd799439032'), // Mountain Bike
		reserver: new ObjectId('507f1f77bcf86cd799439011'), // Alice
		closeRequestedBySharer: false,
		closeRequestedByReserver: false,
		version: 1,
		discriminatorKey: 'reservation-request',
		createdAt: new Date('2023-05-01T10:00:00Z'),
		updatedAt: new Date('2023-05-01T10:00:00Z'),
	},
];
