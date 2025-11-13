import type { Models } from '@sthrift/data-sources-mongoose-models';
import { ObjectId } from 'mongodb';

export const conversations = [
	{
		_id: '807f1f77bcf86cd799439041',
		sharer: new ObjectId('507f1f77bcf86cd799439011'), // Alice
		reserver: new ObjectId('507f1f77bcf86cd799439013'), // Duy
		listing: new ObjectId('707f1f77bcf86cd799439031'), // Lawn Mower
		messagingConversationId: 'CH123',
		schemaVersion: '1.0.0',
		version: 1,
		discriminatorKey: 'conversation',
		createdAt: new Date('2023-04-02T10:00:00Z'),
		updatedAt: new Date('2023-04-02T10:00:00Z'),
	},
	{
		_id: '807f1f77bcf86cd799439042',
		sharer: new ObjectId('507f1f77bcf86cd799439012'), // Bob
		reserver: new ObjectId('507f1f77bcf86cd799439013'), // Duy
		listing: new ObjectId('707f1f77bcf86cd799439032'), // Mountain Bike
		messagingConversationId: 'CH124',
		schemaVersion: '1.0.0',
		version: 1,
		discriminatorKey: 'conversation',
		createdAt: new Date('2023-05-02T10:00:00Z'),
		updatedAt: new Date('2023-05-02T10:00:00Z'),
	},
	{
		_id: '807f1f77bcf86cd799439043',
		sharer: new ObjectId('507f1f77bcf86cd799439013'), // Duy (was Charlie, but Charlie doesn't exist in current seed data)
		reserver: new ObjectId('507f1f77bcf86cd799439012'), // Bob
		listing: new ObjectId('707f1f77bcf86cd799439033'), // City Bike
		messagingConversationId: 'CH125',
		schemaVersion: '1.0.0',
		version: 1,
		discriminatorKey: 'conversation',
		createdAt: new Date('2024-08-15T14:30:00Z'),
		updatedAt: new Date('2024-08-15T14:30:00Z'),
	},
	{
		_id: '807f1f77bcf86cd799439044',
		sharer: new ObjectId('507f1f77bcf86cd799439013'), // Duy
		reserver: new ObjectId('507f1f77bcf86cd799439011'), // Alice
		listing: new ObjectId('707f1f77bcf86cd799439034'), // Power Drill
		messagingConversationId: 'CH126',
		schemaVersion: '1.0.0',
		version: 1,
		discriminatorKey: 'conversation',
		createdAt: new Date('2024-09-01T09:15:00Z'),
		updatedAt: new Date('2024-09-01T09:15:00Z'),
	},
	{
		_id: '807f1f77bcf86cd799439045',
		sharer: new ObjectId('807f1f77bcf86cd799439044'), // Admin Duy
		reserver: new ObjectId('507f1f77bcf86cd799439012'), // Bob
		listing: new ObjectId('707f1f77bcf86cd799439035'), // Garden Tools
		messagingConversationId: 'CH127',
		schemaVersion: '1.0.0',
		version: 1,
		discriminatorKey: 'conversation',
		createdAt: new Date('2024-10-01T10:00:00Z'),
		updatedAt: new Date('2024-10-01T10:00:00Z'),
	},
] as unknown as Models.Conversation.Conversation[];
