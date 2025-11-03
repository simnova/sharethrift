import { store } from '../store.ts';

export function seedMockData(): void {
	console.log('Seeding mock messaging data...');

	const conv1 = store.createConversationWithId(
		'CH123',
		'Customer Support Chat',
		'support_chat_001',
	);
	const conv2 = store.createConversationWithId(
		'CH124',
		'Product Inquiry',
		'inquiry_002',
	);
	const conv3 = store.createConversationWithId(
		'CH125',
		'Order #12345 Discussion',
	);

	if (conv1) {
		store.addParticipant(conv1.id, '507f1f77bcf86cd799439099');
		store.addParticipant(conv1.id, '507f1f77bcf86cd799439011');
	}

	if (conv2) {
		store.addParticipant(conv2.id, '507f1f77bcf86cd799439099');
		store.addParticipant(conv2.id, '507f1f77bcf86cd799439012');
	}

	if (conv3) {
		store.addParticipant(conv3.id, '507f1f77bcf86cd799439099');
		store.addParticipant(conv3.id, '507f1f77bcf86cd799439013');
	}

	if (conv1) {
		store.createMessage(
			conv1.id,
			'Hello, I need help with my account',
			'507f1f77bcf86cd799439099',
		);
		store.createMessage(
			conv1.id,
			'Hi! I\'d be happy to help you with that. What seems to be the issue?',
			'507f1f77bcf86cd799439011',
		);
		store.createMessage(
			conv1.id,
			'I can\'t access my order history',
			'507f1f77bcf86cd799439099',
		);
		store.createMessage(
			conv1.id,
			'Let me look into that for you. Can you provide your order number?',
			'507f1f77bcf86cd799439011',
		);
	}

	if (conv2) {
		store.createMessage(
			conv2.id,
			'Do you have this item in blue?',
			'507f1f77bcf86cd799439099',
		);
		store.createMessage(
			conv2.id,
			'Yes! We have that available in blue. Would you like me to add it to your cart?',
			'507f1f77bcf86cd799439012',
		);
		store.createMessage(
			conv2.id,
			'Yes please, and what\'s the shipping time?',
			'507f1f77bcf86cd799439099',
		);
	}

	if (conv3) {
		store.createMessage(
			conv3.id,
			'When will my order ship?',
			'507f1f77bcf86cd799439099',
		);
		store.createMessage(
			conv3.id,
			'Your order is scheduled to ship tomorrow. You\'ll receive a tracking number via email.',
			'507f1f77bcf86cd799439013',
		);
	}

	const stats = store.getStats();
	console.log('Mock data seeded:', stats);
}
