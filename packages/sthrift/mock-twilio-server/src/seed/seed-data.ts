import { store } from '../store.ts';

/**
 * Seed the mock Twilio store with sample data for testing
 */
export function seedMockData(): void {
	console.log('Seeding mock Twilio data...');

	// Create sample conversations using specific SIDs so they match
	// the seeded domain mock data (mock-conversations.ts). This ensures
	// calls like getMessages(convoId) will find the right conversation.
	const conv1 = store.createConversationWithSid(
		'CH123',
		'Customer Support Chat',
		'support_chat_001',
	);
	const conv2 = store.createConversationWithSid(
		'CH124',
		'Product Inquiry',
		'inquiry_002',
	);
	const conv3 = store.createConversationWithSid(
		'CH125',
		'Order #12345 Discussion',
	);

	// Add participants to conversations
	if (conv1) {
		store.addParticipant(conv1.sid, '507f1f77bcf86cd799439099');
		store.addParticipant(conv1.sid, '507f1f77bcf86cd799439011');
	}

	if (conv2) {
		store.addParticipant(conv2.sid, '507f1f77bcf86cd799439099');
		store.addParticipant(conv2.sid, '507f1f77bcf86cd799439012');
	}

	if (conv3) {
		store.addParticipant(conv3.sid, '507f1f77bcf86cd799439099');
		store.addParticipant(conv3.sid, '507f1f77bcf86cd799439013');
	}

	// Add messages to conversations
	if (conv1) {
		store.createMessage(
			conv1.sid,
			'Hello, I need help with my account',
			'507f1f77bcf86cd799439099',
		);
		store.createMessage(
			conv1.sid,
			'Hi! I\'d be happy to help you with that. What seems to be the issue?',
			'507f1f77bcf86cd799439011',
		);
		store.createMessage(
			conv1.sid,
			'I can\'t access my order history',
			'507f1f77bcf86cd799439099',
		);
		store.createMessage(
			conv1.sid,
			'Let me look into that for you. Can you provide your order number?',
			'507f1f77bcf86cd799439011',
		);
	}

	if (conv2) {
		store.createMessage(
			conv2.sid,
			'Do you have this item in blue?',
			'507f1f77bcf86cd799439099',
		);
		store.createMessage(
			conv2.sid,
			'Yes! We have that available in blue. Would you like me to add it to your cart?',
			'507f1f77bcf86cd799439012',
		);
		store.createMessage(
			conv2.sid,
			'Yes please, and what\'s the shipping time?',
			'507f1f77bcf86cd799439099',
		);
	}

	if (conv3) {
		store.createMessage(
			conv3.sid,
			'When will my order ship?',
			'507f1f77bcf86cd799439099',
		);
		store.createMessage(
			conv3.sid,
			'Your order is scheduled to ship tomorrow. You\'ll receive a tracking number via email.',
			'507f1f77bcf86cd799439013',
		);
	}

	const stats = store.getStats();
	console.log('Mock data seeded:', stats);
}
