import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';

// Mock the individual service modules
vi.mock('./create.ts', () => ({
	create: vi.fn(),
}));
vi.mock('./query-by-id.ts', () => ({
	queryById: vi.fn(),
}));
vi.mock('./query-by-user.ts', () => ({
	queryByUser: vi.fn(),
}));

import { create } from './create.ts';
import { Conversation } from './index.ts';
import { queryById } from './query-by-id.ts';
import { queryByUser } from './query-by-user.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, './features/index.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let service: ReturnType<typeof Conversation>;

	BeforeEachScenario(() => {
		// Reset mocks
		vi.clearAllMocks();

		const mockCreateFn = vi.fn().mockResolvedValue({
			id: 'conv-123',
			sharer: { id: 'sharer-1' },
			reserver: { id: 'reserver-1' },
			listing: { id: 'listing-1' },
		});
		const mockQueryByIdFn = vi.fn().mockResolvedValue({
			id: 'conv-123',
		});
		const mockQueryByUserFn = vi
			.fn()
			.mockResolvedValue([{ id: 'conv-1' }, { id: 'conv-2' }]);

		vi.mocked(create).mockReturnValue(mockCreateFn);
		vi.mocked(queryById).mockReturnValue(mockQueryByIdFn);
		vi.mocked(queryByUser).mockReturnValue(mockQueryByUserFn);

		mockDataSources = {
			domainDataSource: {
				Conversation: {
					Conversation: {
						ConversationUnitOfWork: {
							withScopedTransaction: vi.fn(),
						},
					},
				},
			},
			// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		service = Conversation(mockDataSources);
	});

	Scenario(
		'Creating a conversation through the application service',
		({
			Given,
			When,
			Then,
		}: {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Given: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			When: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Then: any;
		}) => {
			let result: Domain.Contexts.Conversation.Conversation.ConversationEntityReference;

			Given('a conversation application service', () => {
				expect(service).toBeDefined();
			});

			When('I create a conversation', async () => {
				result = await service.create({
					sharerId: 'sharer-1',
					reserverId: 'reserver-1',
					listingId: 'listing-1',
				});
			});

			Then('it should delegate to the create function', () => {
				expect(result).toBeDefined();
				expect(result.id).toBe('conv-123');
			});
		},
	);

	Scenario(
		'Querying a conversation by ID through the application service',
		({
			Given,
			When,
			Then,
		}: {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Given: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			When: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Then: any;
		}) => {
			let result: Domain.Contexts.Conversation.Conversation.ConversationEntityReference | null;

			Given('a conversation application service', () => {
				expect(service).toBeDefined();
			});

			When('I query for conversation with id "conv-123"', async () => {
				result = await service.queryById({ conversationId: 'conv-123' });
			});

			Then('it should delegate to the queryById function', () => {
				expect(result).toBeDefined();
				expect(result?.id).toBe('conv-123');
			});
		},
	);

	Scenario(
		'Querying conversations by user through the application service',
		({
			Given,
			When,
			Then,
		}: {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Given: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			When: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			Then: any;
		}) => {
			let result: Domain.Contexts.Conversation.Conversation.ConversationEntityReference[];

			Given('a conversation application service', () => {
				expect(service).toBeDefined();
			});

			When('I query for conversations by user "user-1"', async () => {
				result = await service.queryByUser({ userId: 'user-1' });
			});

			Then('it should delegate to the queryByUser function', () => {
				expect(result).toBeDefined();
				expect(result.length).toBe(2);
			});
		},
	);
});
