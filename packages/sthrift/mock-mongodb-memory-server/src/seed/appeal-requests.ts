import { ObjectId } from 'mongodb';

export const appealRequests = [
	// Listing appeal requests
	{
		_id: '907f1f77bcf86cd799439051',
		type: 'listing',
		user: new ObjectId('507f1f77bcf86cd799439012'), // Bob
		listing: new ObjectId('707f1f77bcf86cd799439031'), // Lawn Mower (Alice's listing)
		reason:
			'I was blocked from this listing unfairly. I have been a responsible borrower and would like to appeal this decision. The misunderstanding was due to a communication issue that has since been resolved.',
		state: 'requested',
		blocker: new ObjectId('507f1f77bcf86cd799439011'), // Alice (listing owner)
		createdAt: new Date('2023-04-10T14:30:00Z'),
		updatedAt: new Date('2023-04-10T14:30:00Z'),
		schemaVersion: '1.0.0',
		version: 1,
	},
	{
		_id: '907f1f77bcf86cd799439052',
		type: 'listing',
		user: new ObjectId('507f1f77bcf86cd799439013'), // Carol
		listing: new ObjectId('707f1f77bcf86cd799439032'), // Mountain Bike (Bob's listing)
		reason:
			'I believe I was blocked by mistake. I have always returned items on time and in good condition. Please reconsider this block as I genuinely need access to this listing.',
		state: 'accepted',
		blocker: new ObjectId('507f1f77bcf86cd799439012'), // Bob (listing owner)
		createdAt: new Date('2023-05-05T09:15:00Z'),
		updatedAt: new Date('2023-05-06T11:00:00Z'),
		schemaVersion: '1.0.0',
		version: 1,
	},
	{
		_id: '907f1f77bcf86cd799439053',
		type: 'listing',
		user: new ObjectId('507f1f77bcf86cd799439014'), // Another user (would need to be added or use existing)
		listing: new ObjectId('707f1f77bcf86cd799439033'), // Camping Gear
		reason:
			'The block was issued due to a misunderstanding about the return date. I had notified the owner in advance but the message may not have been received. I respectfully request this appeal be reviewed.',
		state: 'denied',
		blocker: new ObjectId('507f1f77bcf86cd799439011'), // Alice
		createdAt: new Date('2023-06-01T16:45:00Z'),
		updatedAt: new Date('2023-06-02T10:20:00Z'),
		schemaVersion: '1.0.0',
		version: 1,
	},

	// User appeal requests (account-level blocks)
	{
		_id: '907f1f77bcf86cd799439054',
		type: 'user',
		user: new ObjectId('507f1f77bcf86cd799439012'), // Bob
		reason:
			'I was blocked from interacting with this user entirely, but I believe this was due to a single miscommunication. I have been a responsible member of the ShareThrift community and would like to resolve this issue.',
		state: 'requested',
		blocker: new ObjectId('507f1f77bcf86cd799439013'), // Carol blocked Bob
		createdAt: new Date('2023-04-15T12:00:00Z'),
		updatedAt: new Date('2023-04-15T12:00:00Z'),
		schemaVersion: '1.0.0',
		version: 1,
	},
	{
		_id: '907f1f77bcf86cd799439055',
		type: 'user',
		user: new ObjectId('507f1f77bcf86cd799439011'), // Alice
		reason:
			'I am appealing the user block as I believe it was issued in error. We had a disagreement about pickup times, but I am committed to better communication going forward.',
		state: 'accepted',
		blocker: new ObjectId('507f1f77bcf86cd799439012'), // Bob blocked Alice
		createdAt: new Date('2023-05-20T08:30:00Z'),
		updatedAt: new Date('2023-05-21T14:15:00Z'),
		schemaVersion: '1.0.0',
		version: 1,
	},
	{
		_id: '907f1f77bcf86cd799439056',
		type: 'user',
		user: new ObjectId('507f1f77bcf86cd799439013'), // Carol
		reason:
			'This user block prevents me from accessing multiple listings. The original issue was minor and I have taken steps to prevent similar situations. I hope we can move past this and restore access.',
		state: 'denied',
		blocker: new ObjectId('507f1f77bcf86cd799439011'), // Alice blocked Carol
		createdAt: new Date('2023-06-10T15:00:00Z'),
		updatedAt: new Date('2023-06-11T09:30:00Z'),
		schemaVersion: '1.0.0',
		version: 1,
	},
];
