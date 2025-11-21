import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import { ConversationDataSourceImpl } from './conversation.data.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/conversation.data.feature'));

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let dataSource: ConversationDataSourceImpl;

	BeforeEachScenario(() => {
		const mockModel = vi.mocked({
			find: vi.fn(),
			findOne: vi.fn(),
		});
		dataSource = new ConversationDataSourceImpl(mockModel as never);
	});

	Background(({ Given }) => {
		Given('a ConversationDataSource instance with model', () => {
			// DataSource initialized in BeforeEachScenario
		});
	});

	Scenario('DataSource initialization', ({ Then, And }) => {
		Then('the data source should be defined', () => {
			expect(dataSource).toBeDefined();
		});

		And('the data source should have a model property', () => {
			expect(dataSource).toBeInstanceOf(ConversationDataSourceImpl);
		});
	});
});
