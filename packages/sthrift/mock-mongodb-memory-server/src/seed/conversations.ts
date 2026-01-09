import type { Models } from '@sthrift/data-sources-mongoose-models';
import { ObjectId } from 'mongodb';

const createConversation = (
	id: string,
	sharerId: string,
	reserverId: string,
	listingId: string,
	messagingId: string,
	createdDate: string,
	reservationRequestId?: string,
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
	...(reservationRequestId && {
		reservationRequest: new ObjectId(reservationRequestId),
	}),
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
	// ========================================
	// CONVERSATION CLEANUP TEST DATA
	// ========================================
	// These conversations are linked to archived listings/reservations and should be scheduled for deletion
	// when the cleanup process runs.

	// Conversation linked to EXPIRED listing (Vintage Record Player - 707f1f77bcf86cd799439041)
	// Expected behavior: Should be scheduled for deletion with expiresAt = sharingPeriodEnd + 6 months
	createConversation(
		'807f1f77bcf86cd799439046',
		'507f1f77bcf86cd799439011', // Alice (sharer of expired listing)
		'507f1f77bcf86cd799439012', // Bob (was interested in expired listing)
		'707f1f77bcf86cd799439041', // Vintage Record Player (Expired)
		'CH128',
		'2023-01-15T10:00:00Z',
	),

	// Conversation linked to CANCELLED listing (Electric Scooter - 707f1f77bcf86cd799439042)
	// Expected behavior: Should be scheduled for deletion with expiresAt = sharingPeriodEnd + 6 months
	createConversation(
		'807f1f77bcf86cd799439047',
		'507f1f77bcf86cd799439012', // Bob (sharer of cancelled listing)
		'507f1f77bcf86cd799439013', // Charlie (was interested in cancelled listing)
		'707f1f77bcf86cd799439042', // Electric Scooter (Cancelled)
		'CH129',
		'2023-06-05T11:00:00Z',
	),

	// Conversation linked to CLOSED reservation request (907f1f77bcf86cd799439053)
	// Expected behavior: Should be scheduled for deletion with expiresAt = reservationPeriodEnd + 6 months
	createConversation(
		'807f1f77bcf86cd799439048',
		'507f1f77bcf86cd799439011', // Alice (sharer of Lawn Mower)
		'507f1f77bcf86cd799439012', // Bob (reserver of closed reservation)
		'707f1f77bcf86cd799439031', // Lawn Mower
		'CH130',
		'2023-02-26T10:00:00Z',
		'907f1f77bcf86cd799439053', // Closed reservation request
	),

	// Conversation linked to REJECTED reservation request (907f1f77bcf86cd799439056)
	// Expected behavior: Should be scheduled for deletion with expiresAt = updatedAt + 6 months
	createConversation(
		'807f1f77bcf86cd799439049',
		'507f1f77bcf86cd799439012', // Bob (sharer of Mountain Bike)
		'507f1f77bcf86cd799439013', // Charlie (reserver of rejected reservation)
		'707f1f77bcf86cd799439032', // Mountain Bike
		'CH131',
		'2023-03-25T12:00:00Z',
		'907f1f77bcf86cd799439056', // Rejected reservation request
	),
] as unknown as Models.Conversation.Conversation[];
