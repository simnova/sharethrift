import type { Models } from '@sthrift/data-sources-mongoose-models';
import { ObjectId } from 'mongodb';

const createConversation = (
	id: string,
	sharerId: string,
	reserverId: string,
	listingId: string,
	messagingId: string,
	createdDate: string,
) => ({
	_id: id,
	sharer: new ObjectId(sharerId),
	reserver: new ObjectId(reserverId),
	listing: new ObjectId(listingId),
	messagingConversationId: messagingId,
	schemaVersion: '1.0.0',
	version: 1,
	discriminatorKey: 'conversation',
	createdAt: new Date(createdDate),
	updatedAt: new Date(createdDate),
});

export const conversations = [
	createConversation(
		'807f1f77bcf86cd799439041',
		'507f1f77bcf86cd799439011', // Alice
		'507f1f77bcf86cd799439013', // Duy
		'707f1f77bcf86cd799439031', // Lawn Mower
		'CH123',
		'2023-04-02T10:00:00Z',
	),
	createConversation(
		'807f1f77bcf86cd799439042',
		'507f1f77bcf86cd799439012', // Bob
		'507f1f77bcf86cd799439013', // Duy
		'707f1f77bcf86cd799439032', // Mountain Bike
		'CH124',
		'2023-05-02T10:00:00Z',
	),
	createConversation(
		'807f1f77bcf86cd799439043',
		'507f1f77bcf86cd799439013', // Duy
		'507f1f77bcf86cd799439012', // Bob
		'707f1f77bcf86cd799439033', // City Bike
		'CH125',
		'2024-08-15T14:30:00Z',
	),
	createConversation(
		'807f1f77bcf86cd799439044',
		'507f1f77bcf86cd799439013', // Duy
		'507f1f77bcf86cd799439011', // Alice
		'707f1f77bcf86cd799439034', // Power Drill
		'CH126',
		'2024-09-01T09:15:00Z',
	),
	createConversation(
		'807f1f77bcf86cd799439045',
		'807f1f77bcf86cd799439044', // Admin Duy
		'507f1f77bcf86cd799439012', // Bob
		'707f1f77bcf86cd799439035', // Garden Tools
		'CH127',
		'2024-10-01T10:00:00Z',
	),
] as unknown as Models.Conversation.Conversation[];
