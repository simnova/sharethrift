import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadFeature, describeFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { DomainDataSourceImplementation } from './index.ts';
import type { ModelsContext } from '../../models-context.ts';
import type { Domain } from '@sthrift/domain';
import { vi } from 'vitest';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'index.feature'));

// Mock the context implementations
vi.mock('./user/index.ts', () => ({
	UserContextPersistence: vi.fn(() => ({
		unitOfWork: vi.fn(),
		repository: vi.fn(),
	})),
}));

vi.mock('./listing/index.ts', () => ({
	ListingContextPersistence: vi.fn(() => ({
		unitOfWork: vi.fn(),
		repository: vi.fn(),
	})),
}));

vi.mock('./conversation/index.ts', () => ({
	ConversationContextPersistence: vi.fn(() => ({
		unitOfWork: vi.fn(),
		repository: vi.fn(),
	})),
}));

vi.mock('./reservation-request/index.ts', () => ({
	ReservationRequestContextPersistence: vi.fn(() => ({
		unitOfWork: vi.fn(),
		repository: vi.fn(),
	})),
}));

vi.mock('./appeal-request/index.ts', () => ({
	AppealRequestContextPersistence: vi.fn(() => ({
		unitOfWork: vi.fn(),
		repository: vi.fn(),
	})),
}));

vi.mock('./account-plan/index.ts', () => ({
	AccountPlanContextPersistence: vi.fn(() => ({
		unitOfWork: vi.fn(),
		repository: vi.fn(),
	})),
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
		AccountPlan: {
			AccountPlanModel: {},
		},
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

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let mockModelsContext: ModelsContext;
	let mockPassport: Domain.Passport;

	BeforeEachScenario(() => {
		vi.clearAllMocks();
		mockModelsContext = makeMockModelsContext();
		mockPassport = makeMockPassport();
	});

	Background(({ Given, And }) => {
		Given('a ModelsContext is available', () => {
			expect(makeMockModelsContext).toBeDefined();
		});

		And('a Passport is available', () => {
			expect(makeMockPassport).toBeDefined();
		});
	});

	Scenario(
		'Creating DomainDataSource with valid models and passport',
		({ Given, When, Then, And }) => {
			let domainDataSource: ReturnType<typeof DomainDataSourceImplementation>;

			Given('the ModelsContext is valid', () => {
				expect(mockModelsContext).toBeDefined();
			});

			And('the Passport is valid', () => {
				expect(mockPassport).toBeDefined();
			});

			When('the DomainDataSource is created', () => {
				domainDataSource = DomainDataSourceImplementation(mockModelsContext, mockPassport);
			});

			Then('a DomainDataSource object should be returned', () => {
				expect(domainDataSource).toBeDefined();
			});

			And('the DomainDataSource should have a User property', () => {
				expect(domainDataSource.User).toBeDefined();
			});

			And('the DomainDataSource should have a Listing property', () => {
				expect(domainDataSource.Listing).toBeDefined();
			});

			And('the DomainDataSource should have a Conversation property', () => {
				expect(domainDataSource.Conversation).toBeDefined();
			});

			And('the DomainDataSource should have a ReservationRequest property', () => {
				expect(domainDataSource.ReservationRequest).toBeDefined();
			});

			And('the DomainDataSource should have an AppealRequest property', () => {
				expect(domainDataSource.AppealRequest).toBeDefined();
			});
		},
	);

	Scenario('DomainDataSource context initialization', ({ Given, When, Then, And }) => {
		let domainDataSource: ReturnType<typeof DomainDataSourceImplementation>;

		Given('valid models and passport', () => {
			expect(mockModelsContext).toBeDefined();
			expect(mockPassport).toBeDefined();
		});

		When('the DomainDataSource is created', () => {
			domainDataSource = DomainDataSourceImplementation(mockModelsContext, mockPassport);
		});

		Then('each context should be properly initialized', () => {
			expect(domainDataSource.User).toBeDefined();
			expect(domainDataSource.Listing).toBeDefined();
			expect(domainDataSource.Conversation).toBeDefined();
			expect(domainDataSource.ReservationRequest).toBeDefined();
			expect(domainDataSource.AppealRequest).toBeDefined();
		});

		And('User context should have repository and unit of work', () => {
			expect(domainDataSource.User).toBeDefined();
			expect(typeof domainDataSource.User).toBe('object');
		});

		And('Listing context should have repository and unit of work', () => {
			expect(domainDataSource.Listing).toBeDefined();
			expect(typeof domainDataSource.Listing).toBe('object');
		});

		And('Conversation context should have repository and unit of work', () => {
			expect(domainDataSource.Conversation).toBeDefined();
			expect(typeof domainDataSource.Conversation).toBe('object');
		});

		And('ReservationRequest context should have repository and unit of work', () => {
			expect(domainDataSource.ReservationRequest).toBeDefined();
			expect(typeof domainDataSource.ReservationRequest).toBe('object');
		});

		And('AppealRequest context should have repository and unit of work', () => {
			expect(domainDataSource.AppealRequest).toBeDefined();
			expect(typeof domainDataSource.AppealRequest).toBe('object');
		});
	});

	Scenario('DomainDataSourceImplementation exports', ({ Then }) => {
		Then('the DomainDataSourceImplementation function should be exported', () => {
			expect(DomainDataSourceImplementation).toBeDefined();
			expect(typeof DomainDataSourceImplementation).toBe('function');
		});
	});
});
