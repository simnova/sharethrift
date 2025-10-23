import { store } from '../store.ts';

/**
 * Seed the mock Twilio store with sample data for testing
 */
export function seedMockData(): void {
	console.log('Seeding mock Twilio data...');

	// Create sample conversations
	const conv1 = store.createConversation(
		'Customer Support Chat',
		'support_chat_001',
	);
	const conv2 = store.createConversation(
		'Product Inquiry',
		'inquiry_002',
	);
	const conv3 = store.createConversation(
		'Order #12345 Discussion',
	);

	// Add participants to conversations
	if (conv1) {
		store.addParticipant(conv1.sid, 'customer@example.com');
		store.addParticipant(conv1.sid, 'agent@example.com');
	}

	if (conv2) {
		store.addParticipant(conv2.sid, 'buyer@example.com');
		store.addParticipant(conv2.sid, 'sales@example.com');
	}

	if (conv3) {
		store.addParticipant(conv3.sid, 'user123@example.com');
		store.addParticipant(conv3.sid, 'support@example.com');
	}

	// Add messages to conversations
	if (conv1) {
		store.createMessage(
			conv1.sid,
			'Hello, I need help with my account',
			'customer@example.com',
		);
		store.createMessage(
			conv1.sid,
			'Hi! I\'d be happy to help you with that. What seems to be the issue?',
			'agent@example.com',
		);
		store.createMessage(
			conv1.sid,
			'I can\'t access my order history',
			'customer@example.com',
		);
		store.createMessage(
			conv1.sid,
			'Let me look into that for you. Can you provide your order number?',
			'agent@example.com',
		);
	}

	if (conv2) {
		store.createMessage(
			conv2.sid,
			'Do you have this item in blue?',
			'buyer@example.com',
		);
		store.createMessage(
			conv2.sid,
			'Yes! We have that available in blue. Would you like me to add it to your cart?',
			'sales@example.com',
		);
		store.createMessage(
			conv2.sid,
			'Yes please, and what\'s the shipping time?',
			'buyer@example.com',
		);
	}

	if (conv3) {
		store.createMessage(
			conv3.sid,
			'When will my order ship?',
			'user123@example.com',
		);
		store.createMessage(
			conv3.sid,
			'Your order is scheduled to ship tomorrow. You\'ll receive a tracking number via email.',
			'support@example.com',
		);
	}

	const stats = store.getStats();
	console.log('Mock data seeded:', stats);
}
