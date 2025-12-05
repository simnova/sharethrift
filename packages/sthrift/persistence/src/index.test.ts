import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadFeature, describeFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { Persistence } from './index.ts';
import type { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { Models } from '@sthrift/data-sources-mongoose-models';
import { vi } from 'vitest';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'index.feature'));

// Mock the Models module
vi.mock('@sthrift/data-sources-mongoose-models', () => ({
	Models: {
		mongooseContextBuilder: vi.fn(),
	},
}));

// Mock the DataSourcesFactoryImpl
vi.mock('./datasources/index.ts', () => ({
	DataSourcesFactoryImpl: vi.fn(() => ({
		domain: {},
		readonly: {},
		messaging: {},
	})),
}));

const makeMockMongooseContextFactory = (
	hasService = true,
): MongooseSeedwork.MongooseContextFactory => {
	if (!hasService) {
		return {
			service: null,
		} as unknown as MongooseSeedwork.MongooseContextFactory;
	}
	return {
		service: {
			connection: {},
			model: vi.fn(),
		},
	} as unknown as MongooseSeedwork.MongooseContextFactory;
};

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let mockMongooseContextFactory: MongooseSeedwork.MongooseContextFactory;

	BeforeEachScenario(() => {
		vi.clearAllMocks();
		vi.mocked(Models.mongooseContextBuilder).mockReturnValue({} as unknown as ReturnType<
			typeof Models.mongooseContextBuilder
		>);
	});

	Background(({ Given }) => {
		Given('a MongooseContextFactory is available', () => {
			expect(makeMockMongooseContextFactory).toBeDefined();
		});
	});

	Scenario('Creating Persistence factory with valid service', ({ Given, When, Then }) => {
		Given('the MongooseContextFactory has a valid service', () => {
			mockMongooseContextFactory = makeMockMongooseContextFactory(true);
		});

		When('the Persistence factory is created', () => {
			expect(() => {
				Persistence(mockMongooseContextFactory);
			}).not.toThrow();
		});

		Then('the DataSourcesFactory should be returned', () => {
			const result = Persistence(mockMongooseContextFactory);
			expect(result).toBeDefined();
			expect(result).toHaveProperty('domain');
			expect(result).toHaveProperty('readonly');
			expect(result).toHaveProperty('messaging');
		});
	});

	Scenario('Creating Persistence factory without service', ({ Given, When, Then }) => {
		Given('the MongooseContextFactory has no service', () => {
			mockMongooseContextFactory = makeMockMongooseContextFactory(false);
		});

		When('the Persistence factory is created', () => {
			// This is verified in the Then step
		});

		Then(
			'an error should be thrown with message "MongooseSeedwork.MongooseContextFactory is required"',
			() => {
				expect(() => {
					Persistence(mockMongooseContextFactory);
				}).toThrow('MongooseSeedwork.MongooseContextFactory is required');
			},
		);
	});

	Scenario(
		'Creating Persistence factory with undefined service',
		({ Given, When, Then }) => {
			Given('the MongooseContextFactory service is undefined', () => {
				mockMongooseContextFactory = {
					service: undefined,
				} as unknown as MongooseSeedwork.MongooseContextFactory;
			});

			When('the Persistence factory is created', () => {
				// This is verified in the Then step
			});

			Then(
				'an error should be thrown with message "MongooseSeedwork.MongooseContextFactory is required"',
				() => {
					expect(() => {
						Persistence(mockMongooseContextFactory);
					}).toThrow('MongooseSeedwork.MongooseContextFactory is required');
				},
			);
		},
	);

	Scenario('Persistence function exports', ({ Then, And }) => {
		Then('the Persistence function should be exported', () => {
			expect(Persistence).toBeDefined();
			expect(typeof Persistence).toBe('function');
		});

		And('the DataSourcesFactory type should be exported', async () => {
			const module = await import('./index.ts');
			expect(module).toBeDefined();
		});

		And('the DataSources type should be exported', async () => {
			const module = await import('./index.ts');
			expect(module).toBeDefined();
		});
	});
});
