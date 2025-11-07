import { store } from '../store.ts';

export function seedMockData(): void {
	console.log('Seeding mock messaging data...');

	const conv1 = store.createConversationWithId(
		'CH123',
		'Lawn Mower Chat',
	);
	const conv2 = store.createConversationWithId(
		'CH124',
		'Mountain Bike Chat',
	);
	const conv3 = store.createConversationWithId(
		'CH125',
		'City Bike Chat',
	);

    const conv4 = store.createConversationWithId(
		'CH126',
		'Power Drill Chat',
	);

	if (conv1) {
		store.addParticipant(conv1.id, '507f1f77bcf86cd799439011');
		store.addParticipant(conv1.id, '507f1f77bcf86cd799439014');
	}

	if (conv2) {
		store.addParticipant(conv2.id, '507f1f77bcf86cd799439012');
		store.addParticipant(conv2.id, '507f1f77bcf86cd799439014');
	}

	if (conv3) {
		store.addParticipant(conv3.id, '507f1f77bcf86cd799439013');
		store.addParticipant(conv3.id, '507f1f77bcf86cd799439014');
	}

    if (conv4) {
		store.addParticipant(conv4.id, '507f1f77bcf86cd799439014');
		store.addParticipant(conv4.id, '507f1f77bcf86cd799439013');
	}

	if (conv1) {
		store.createMessage(
			conv1.id,
			"Hi, I'm interested in the lawn mower. Is it suitable for a large backyard?",
			'507f1f77bcf86cd799439014',
		);
		store.createMessage(
			conv1.id,
			"Absolutely! It's designed for yards up to half an acre. Do you have any specific grass type?",
			'507f1f77bcf86cd799439011',
		);
		store.createMessage(
			conv1.id,
			"Mostly Bermuda grass. Does it handle thick patches well?",
			'507f1f77bcf86cd799439014',
		);
		store.createMessage(
			conv1.id,
			"Yes, the mower has adjustable blades and a powerful motor for thick grass.",
			'507f1f77bcf86cd799439011',
		);
	}

	if (conv2) {
		store.createMessage(
			conv2.id,
			"Hey, is the mountain bike good for rocky trails?",
			'507f1f77bcf86cd799439014',
		);
		store.createMessage(
			conv2.id,
			"Yes, it has full suspension and durable tires for rough terrain.",
			'507f1f77bcf86cd799439012',
		);
		store.createMessage(
			conv2.id,
			"Does it come with a repair kit or do I need to buy one separately?",
			'507f1f77bcf86cd799439014',
		);
		store.createMessage(
			conv2.id,
			"A basic kit is included, but you can upgrade for more tools.",
			'507f1f77bcf86cd799439012',
		);
	}

	if (conv3) {
		store.createMessage(
			conv3.id,
			"Is the city bike comfortable for daily commutes?",
			'507f1f77bcf86cd799439014',
		);
		store.createMessage(
			conv3.id,
			"Definitely! It has a padded seat and upright handlebars for comfort.",
			'507f1f77bcf86cd799439013',
		);
		store.createMessage(
			conv3.id,
			"Can I attach a basket or rack to it?",
			'507f1f77bcf86cd799439014',
		);
		store.createMessage(
			conv3.id,
			"Yes, it comes with mounting points for both accessories.",
			'507f1f77bcf86cd799439013',
		);
	}

    if (conv4) {
			store.createMessage(
				conv4.id,
				"Hi, does the power drill work on concrete walls?",
				'507f1f77bcf86cd799439014',
			);
			store.createMessage(
				conv4.id,
				"Yes, it comes with masonry bits and has enough torque for concrete.",
				'507f1f77bcf86cd799439013',
			);
			store.createMessage(
				conv4.id,
				"How long does the battery last on a full charge?",
				'507f1f77bcf86cd799439014',
			);
			store.createMessage(
				conv4.id,
				"About 2 hours of continuous use. It also has a fast-charging feature.",
				'507f1f77bcf86cd799439013',
			);
	}

	const stats = store.getStats();
	console.log('Mock data seeded:', stats);
}
