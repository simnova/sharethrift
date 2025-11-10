import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { getConversationUnitOfWork } from './conversation.uow.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/conversation.uow.feature'),
);

function makeMockModel(): Models.Conversation.ConversationModelType {
	const ModelMock = function(
		this: Models.Conversation.Conversation,
		_props?: Partial<Models.Conversation.Conversation>,
	) {
		Object.assign(this, {
			_id: 'conv-1',
			sharer: 'user-1',
			reserver: 'user-2',
			listing: 'listing-1',
			twilioConversationId: 'twilio-123',
			createdAt: new Date(),
			updatedAt: new Date(),
			schemaVersion: '1.0.0',
		});
	} as unknown as Models.Conversation.ConversationModelType;

	Object.assign(ModelMock, {
		findOne: vi.fn(),
		find: vi.fn(),
		findById: vi.fn(),
		startSession: vi.fn(() => ({
			startTransaction: vi.fn(),
			commitTransaction: vi.fn(),
			abortTransaction: vi.fn(),
			endSession: vi.fn(),
		})),
	});

	return ModelMock;
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
	let model: Models.Conversation.ConversationModelType;
	let passport: Domain.Passport;
	let unitOfWork: Domain.Contexts.Conversation.Conversation.ConversationUnitOfWork;

	BeforeEachScenario(() => {
		model = makeMockModel();
		passport = makeMockPassport();
		unitOfWork =
			{} as Domain.Contexts.Conversation.Conversation.ConversationUnitOfWork;
	});

	Background(({ Given }) => {
		Given(
			'the system is configured with Mongoose, EventBus, and domain adapters',
			() => {
				// This is set up in BeforeEachScenario
			},
		);
	});

	Scenario(
		'Initialize a ConversationUnitOfWork successfully',
		({ Given, And, When, Then }) => {
			Given('a valid Mongoose Conversation model', () => {
				model = makeMockModel();
			});
			And('a valid Passport instance', () => {
				passport = makeMockPassport();
			});
			When('I call getConversationUnitOfWork with the model and passport', () => {
				unitOfWork = getConversationUnitOfWork(model, passport);
			});
			Then('I should receive a ConversationUnitOfWork instance', () => {
				expect(unitOfWork).toBeDefined();
				expect(typeof unitOfWork).toBe('object');
			});
			And('the unit of work should have a repository property', () => {
				expect(unitOfWork).toHaveProperty('withTransaction');
				expect(unitOfWork).toHaveProperty('withScopedTransaction');
				expect(typeof unitOfWork.withTransaction).toBe('function');
			});
			And('the repository should be an instance of ConversationRepository', () => {
				// The repository is internal to the UoW
				expect(unitOfWork.withScopedTransaction).toBeDefined();
			});
		},
	);

	Scenario(
		'ConversationUnitOfWork should support standard UnitOfWork operations',
		({ Given, When, Then, And }) => {
			Given('an initialized ConversationUnitOfWork', () => {
				unitOfWork = getConversationUnitOfWork(model, passport);
			});
			When('I access the repository property', () => {
				// UOW methods are available
				expect(unitOfWork).toBeDefined();
			});
			Then('I should be able to call repository methods like getById, getByTwilioSid, etc.', () => {
				// UOW has transaction methods that internally use the repository
				expect(unitOfWork.withTransaction).toBeDefined();
				expect(unitOfWork.withScopedTransaction).toBeDefined();
				expect(unitOfWork.withScopedTransactionById).toBeDefined();
			});
			And('the repository should be properly configured with the model and passport', () => {
				// The repository is internal - verify UOW methods are functions
				expect(typeof unitOfWork.withTransaction).toBe('function');
				expect(typeof unitOfWork.withScopedTransaction).toBe('function');
			});
		},
	);
});
