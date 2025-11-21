import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadFeature, describeFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { DataSourcesFactoryImpl } from './index.ts';
import type { ModelsContext } from '../models-context.ts';
import { Domain } from '@sthrift/domain';
import type { MessagingService } from '@cellix/messaging-service';
import { vi } from 'vitest';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'index.feature'));

// Mock the implementations
vi.mock('./domain/index.ts', () => ({
	DomainDataSourceImplementation: vi.fn(() => ({ domain: 'mocked' })),
}));

vi.mock('./readonly/index.ts', () => ({
	ReadonlyDataSourceImplementation: vi.fn(() => ({ readonly: 'mocked' })),
}));

vi.mock('./messaging/index.ts', () => ({
	MessagingDataSourceImplementation: vi.fn(() => ({ messaging: 'mocked' })),
}));

const makeMockModelsContext = (): ModelsContext => {
	return {
		UserAppealRequestModel: {},
		ListingAppealRequestModel: {},
		ConversationModel: {},
		CommunityAdminUserModel: {},
		CommunityPersonalUserModel: {},
		ListingItemModel: {},
		ReservationRequestModel: {},
		RoleModel: {},
	} as unknown as ModelsContext;
};

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
	let mockModelsContext: ModelsContext;
	let factory: ReturnType<typeof DataSourcesFactoryImpl>;

	BeforeEachScenario(() => {
		vi.clearAllMocks();
		mockModelsContext = makeMockModelsContext();
	});

	Background(({ Given }) => {
		Given('a ModelsContext is available', () => {
			expect(makeMockModelsContext).toBeDefined();
		});
	});

	Scenario('Creating DataSourcesFactory with valid models', ({ Given, When, Then, And }) => {
		Given('the ModelsContext is valid', () => {
			expect(mockModelsContext).toBeDefined();
		});

		When('the DataSourcesFactory is created', () => {
			factory = DataSourcesFactoryImpl(mockModelsContext);
		});

		Then('the factory should have a withPassport method', () => {
			expect(factory).toBeDefined();
			expect(factory.withPassport).toBeDefined();
			expect(typeof factory.withPassport).toBe('function');
		});

		And('the factory should have a withSystemPassport method', () => {
			expect(factory.withSystemPassport).toBeDefined();
			expect(typeof factory.withSystemPassport).toBe('function');
		});
	});

	Scenario(
		'Creating DataSources with Passport and MessagingService',
		({ Given, When, Then, And }) => {
			let mockPassport: Domain.Passport;
			let mockMessagingService: MessagingService;
			let dataSources: ReturnType<typeof factory.withPassport>;

			Given('a valid Passport is provided', () => {
				mockPassport = makeMockPassport();
				expect(mockPassport).toBeDefined();
			});

			And('a valid MessagingService is provided', () => {
				mockMessagingService = makeMockMessagingService();
				expect(mockMessagingService).toBeDefined();
			});

			When('withPassport is called', () => {
				factory = DataSourcesFactoryImpl(mockModelsContext);
				dataSources = factory.withPassport(mockPassport, mockMessagingService);
			});

			Then('a DataSources object should be returned', () => {
				expect(dataSources).toBeDefined();
			});

			And('the DataSources should have a domainDataSource', () => {
				expect(dataSources.domainDataSource).toBeDefined();
			});

			And('the DataSources should have a readonlyDataSource', () => {
				expect(dataSources.readonlyDataSource).toBeDefined();
			});

			And('the DataSources should have a messagingDataSource', () => {
				expect(dataSources.messagingDataSource).toBeDefined();
			});
		},
	);

	Scenario('Creating DataSources with SystemPassport', ({ When, Then, And }) => {
		let dataSources: ReturnType<typeof factory.withSystemPassport>;

		When('withSystemPassport is called', () => {
			factory = DataSourcesFactoryImpl(mockModelsContext);
			dataSources = factory.withSystemPassport();
		});

		Then('a DataSources object should be returned', () => {
			expect(dataSources).toBeDefined();
		});

		And('the DataSources should have a domainDataSource', () => {
			expect(dataSources.domainDataSource).toBeDefined();
		});

		And('the DataSources should have a readonlyDataSource', () => {
			expect(dataSources.readonlyDataSource).toBeDefined();
		});

		And('the DataSources should not have a messagingDataSource', () => {
			expect(dataSources.messagingDataSource).toBeUndefined();
		});
	});

	Scenario('DataSourcesFactory exports', ({ Then, And }) => {
		Then('the DataSourcesFactoryImpl function should be exported', () => {
			expect(DataSourcesFactoryImpl).toBeDefined();
			expect(typeof DataSourcesFactoryImpl).toBe('function');
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
