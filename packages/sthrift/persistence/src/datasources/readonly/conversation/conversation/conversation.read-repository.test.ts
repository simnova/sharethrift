import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { ModelsContext } from '../../../../models-context.ts';
import { ConversationReadRepositoryImpl } from './conversation.read-repository.ts';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/conversation.read-repository.feature'),
);

function makeConversationDoc(
	overrides: Partial<Models.Conversation.Conversation> = {},
): Models.Conversation.Conversation {
	return {
		_id: 'conv-1',
		id: 'conv-1',
		sharer: new MongooseSeedwork.ObjectId(),
		reserver: new MongooseSeedwork.ObjectId(),
		listing: 'listing-1',
		twilioConversationId: 'twilio-123',
		createdAt: new Date('2020-01-01T00:00:00Z'),
		updatedAt: new Date('2020-01-02T00:00:00Z'),
		schemaVersion: '1.0.0',
		...overrides,
	} as Models.Conversation.Conversation;
}

function makeMockModel(
	docs: Models.Conversation.Conversation[],
): Models.Conversation.ConversationModelType {
	return {
		find: vi.fn(() => ({
			populate: vi.fn().mockReturnThis(),
			exec: vi.fn(() => Promise.resolve(docs)),
		})),
		findById: vi.fn((id: string) => ({
			populate: vi.fn().mockReturnThis(),
			exec: vi.fn(() =>
				Promise.resolve(
					docs.find((d) => {
						const docId = typeof d._id === 'string' ? d._id : d._id?.toString();
						return docId === id || String(d.id) === id;
					}) || null,
				),
			),
		})),
		findOne: vi.fn(() => ({
			populate: vi.fn().mockReturnThis(),
			exec: vi.fn(() => Promise.resolve(docs[0] || null)),
		})),
	} as unknown as Models.Conversation.ConversationModelType;
}

function makeMockModelsContext(
	model: Models.Conversation.ConversationModelType,
): ModelsContext {
	return {
		Conversation: {
			ConversationModel: model,
		},
	} as ModelsContext;
}

function makeMockPassport(): Domain.Passport {
	return {
		conversation: {
			forConversation: vi.fn(() => ({
				determineIf: vi.fn(() => true),
			})),
		},
		user: {
			forPersonalUser: vi.fn(() => ({
				determineIf: vi.fn(() => true),
			})),
		},
		listing: {
			forItemListing: vi.fn(() => ({
				determineIf: vi.fn(() => true),
			})),
		},
	} as unknown as Domain.Passport;
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let repo: ConversationReadRepositoryImpl;
	let model: Models.Conversation.ConversationModelType;
	let modelsContext: ModelsContext;
	let passport: Domain.Passport;
	let conversationDocs: Models.Conversation.Conversation[];
	let result: Domain.Contexts.Conversation.Conversation.ConversationEntityReference[] | Domain.Contexts.Conversation.Conversation.ConversationEntityReference | null;

	BeforeEachScenario(() => {
		conversationDocs = [makeConversationDoc()];
		model = makeMockModel(conversationDocs);
		modelsContext = makeMockModelsContext(model);
		passport = makeMockPassport();
		repo = new ConversationReadRepositoryImpl(modelsContext, passport);
		result = null;
	});

	Background(({ Given }) => {
		Given('a ConversationReadRepository with a Mongoose model and passport', () => {
			repo = new ConversationReadRepositoryImpl(modelsContext, passport);
		});
	});

	Scenario('Retrieve all conversations', ({ When, Then, And }) => {
		When('I call getAll', async () => {
			result = await repo.getAll();
		});
		Then('I should receive a list of ConversationEntityReference objects', () => {
			expect(result).toBeInstanceOf(Array);
			expect((result as unknown[]).length).toBeGreaterThan(0);
		});
		And('each object should have sharer, reserver, listing, and twilioConversationId', () => {
			const conversations = result as Domain.Contexts.Conversation.Conversation.ConversationEntityReference[];
			for (const conv of conversations) {
				expect(conv.sharer).toBeDefined();
				expect(conv.reserver).toBeDefined();
				expect(conv.listing).toBeDefined();
				expect(conv.twilioConversationId).toBeDefined();
			}
		});
	});

	Scenario(
		'Retrieve all conversations with pagination options',
		({ Given, When, Then }) => {
			let options: { limit?: number; skip?: number };
			Given('pagination options with limit and skip', () => {
				options = { limit: 10, skip: 0 };
			});
			When('I call getAll with the pagination options', async () => {
				result = await repo.getAll(options);
			});
			Then('I should receive a paginated list of ConversationEntityReference objects', () => {
				expect(result).toBeInstanceOf(Array);
			});
		},
	);

	Scenario('Retrieve a conversation by ID', ({ Given, When, Then, And }) => {
		let conversationId: string;
		Given('a valid conversation ID', () => {
			conversationId = 'conv-1';
		});
		When('I call getById with the conversation ID', async () => {
			result = await repo.getById(conversationId);
		});
		Then('I should receive the ConversationEntityReference for that ID', () => {
			expect(result).toBeDefined();
			expect(result).not.toBeNull();
		});
		And('the object should have the correct twilioConversationId', () => {
			const conversation = result as Domain.Contexts.Conversation.Conversation.ConversationEntityReference;
			expect(conversation.twilioConversationId).toBe('twilio-123');
		});
	});

	Scenario(
		'Retrieve a non-existent conversation by ID',
		({ Given, When, Then }) => {
			let conversationId: string;
			Given('a conversation ID that does not exist', () => {
				conversationId = 'non-existent-id';
			});
			When('I call getById with the non-existent ID', async () => {
				result = await repo.getById(conversationId);
			});
			Then('I should receive null', () => {
				expect(result).toBeNull();
			});
		},
	);

	Scenario('Retrieve conversations by user ID', ({ Given, When, Then, And }) => {
		let userId: string;
		Given('a valid user ID', () => {
			const sharerId = conversationDocs[0]?.sharer;
			userId = (sharerId as MongooseSeedwork.ObjectId).toString();
		});
		When('I call getByUser with the user ID', async () => {
			result = await repo.getByUser(userId);
		});
		Then('I should receive a list of ConversationEntityReference objects', () => {
			expect(result).toBeInstanceOf(Array);
		});
		And('each conversation should have the user as either sharer or reserver', () => {
			const conversations = result as Domain.Contexts.Conversation.Conversation.ConversationEntityReference[];
			for (const conv of conversations) {
				const isSharer = conv.sharer.id === userId;
				const isReserver = conv.reserver.id === userId;
				expect(isSharer || isReserver).toBe(true);
			}
		});
	});

	Scenario(
		'Retrieve conversations by user ID with no results',
		({ Given, When, Then }) => {
			let userId: string;
			Given('a user ID that has no conversations', () => {
				userId = new MongooseSeedwork.ObjectId().toString();
				model = makeMockModel([]);
				modelsContext = makeMockModelsContext(model);
				repo = new ConversationReadRepositoryImpl(modelsContext, passport);
			});
			When('I call getByUser with that user ID', async () => {
				result = await repo.getByUser(userId);
			});
			Then('I should receive an empty array', () => {
				expect(result).toBeInstanceOf(Array);
				expect((result as unknown[]).length).toBe(0);
			});
		},
	);

	Scenario(
		'Retrieve conversations by user ID with empty string',
		({ Given, When, Then }) => {
			let userId: string;
			Given('an empty string as user ID', () => {
				userId = '';
			});
			When('I call getByUser with the empty string', async () => {
				result = await repo.getByUser(userId);
			});
			Then('I should receive an empty array', () => {
				expect(result).toBeInstanceOf(Array);
				expect((result as unknown[]).length).toBe(0);
			});
		},
	);

	Scenario(
		'Retrieve conversations by user ID with invalid ObjectId',
		({ Given, When, Then }) => {
			let userId: string;
			Given('an invalid ObjectId string', () => {
				userId = 'invalid-object-id';
			});
			When('I call getByUser with the invalid ID', async () => {
				result = await repo.getByUser(userId);
			});
			Then('I should receive an empty array', () => {
				expect(result).toBeInstanceOf(Array);
				expect((result as unknown[]).length).toBe(0);
			});
		},
	);
});
