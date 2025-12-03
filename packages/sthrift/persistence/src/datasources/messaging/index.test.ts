import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadFeature, describeFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { MessagingDataSourceImplementation } from './index.ts';
import type { Domain } from '@sthrift/domain';
import type { MessagingService } from '@cellix/messaging-service';
import { vi } from 'vitest';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'index.feature'));

// Mock the context implementation
vi.mock('./conversation/index.ts', () => ({
	MessagingConversationContext: vi.fn(() => ({
		Conversation: {
			MessagingConversationRepo: {},
		},
	})),
}));

const makeMockPassport = (): Domain.Passport => {
	return vi.mocked({
		conversation: {
			forConversation: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
		user: {
			forPersonalUser: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
	} as unknown as Domain.Passport);
};

const makeMockMessagingService = (): MessagingService => {
	return {
		sendMessage: vi.fn(),
		connect: vi.fn(),
		disconnect: vi.fn(),
	} as unknown as MessagingService;
};

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let mockMessagingService: MessagingService;
	let mockPassport: Domain.Passport;

	BeforeEachScenario(() => {
		vi.clearAllMocks();
		mockMessagingService = makeMockMessagingService();
		mockPassport = makeMockPassport();
	});

	Background(({ Given, And }) => {
		Given('a MessagingService is available', () => {
			expect(makeMockMessagingService).toBeDefined();
		});

		And('a Passport is available', () => {
			expect(makeMockPassport).toBeDefined();
		});
	});

	Scenario(
		'Creating MessagingDataSource with valid service and passport',
		({ Given, When, Then, And }) => {
			let messagingDataSource: ReturnType<typeof MessagingDataSourceImplementation>;

			Given('the MessagingService is valid', () => {
				expect(mockMessagingService).toBeDefined();
			});

			And('the Passport is valid', () => {
				expect(mockPassport).toBeDefined();
			});

			When('the MessagingDataSource is created', () => {
				messagingDataSource = MessagingDataSourceImplementation(
					mockMessagingService,
					mockPassport,
				);
			});

			Then('a MessagingDataSource object should be returned', () => {
				expect(messagingDataSource).toBeDefined();
			});

			And('the MessagingDataSource should have a Conversation property', () => {
				expect(messagingDataSource.Conversation).toBeDefined();
			});
		},
	);

	Scenario('MessagingDataSource context structure', ({ Given, When, Then, And }) => {
		let messagingDataSource: ReturnType<typeof MessagingDataSourceImplementation>;

		Given('valid messaging service and passport', () => {
			expect(mockMessagingService).toBeDefined();
			expect(mockPassport).toBeDefined();
		});

		When('the MessagingDataSource is created', () => {
			messagingDataSource = MessagingDataSourceImplementation(
				mockMessagingService,
				mockPassport,
			);
		});

		Then('Conversation context should have Conversation property', () => {
			expect(messagingDataSource.Conversation.Conversation).toBeDefined();
		});

		And('Conversation should have MessagingConversationRepo', () => {
			expect(messagingDataSource.Conversation.Conversation.MessagingConversationRepo).toBeDefined();
		});
	});

	Scenario('MessagingDataSourceImplementation exports', ({ Then, And }) => {
		Then('the MessagingDataSourceImplementation function should be exported', () => {
			expect(MessagingDataSourceImplementation).toBeDefined();
			expect(typeof MessagingDataSourceImplementation).toBe('function');
		});

		And('the MessagingDataSource type should be exported', async () => {
			const module = await import('./index.ts');
			expect(module).toBeDefined();
		});
	});
});
