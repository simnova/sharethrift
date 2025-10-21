import type { Models } from '@sthrift/data-sources-mongoose-models';
import { ObjectId } from 'mongodb';

export const conversations = [
	{
		_id: '807f1f77bcf86cd799439041',
		sharer: new ObjectId('507f1f77bcf86cd799439011'), // Alice
		reserver: new ObjectId('507f1f77bcf86cd799439012'), // Bob
		listing: new ObjectId('707f1f77bcf86cd799439031'), // Lawn Mower
		twilioConversationId: 'twilio_001',
		schemaVersion: '1.0.0',
		version: 1,
		discriminatorKey: 'conversation',
		createdAt: new Date('2023-04-02T10:00:00Z'),
		updatedAt: new Date('2023-04-02T10:00:00Z'),
	},
	{
		_id: '807f1f77bcf86cd799439042',
		sharer: new ObjectId('507f1f77bcf86cd799439012'), // Bob
		reserver: new ObjectId('507f1f77bcf86cd799439011'), // Alice
		listing: new ObjectId('707f1f77bcf86cd799439032'), // Mountain Bike
		twilioConversationId: 'twilio_002',
		schemaVersion: '1.0.0',
		version: 1,
		discriminatorKey: 'conversation',
		createdAt: new Date('2023-05-02T10:00:00Z'),
		updatedAt: new Date('2023-05-02T10:00:00Z'),
	},
] as unknown as Models.Conversation.Conversation[];
