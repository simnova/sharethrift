import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadFeature, describeFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { ReadonlyDataSourceImplementation } from './index.ts';
import type { ModelsContext } from '../../models-context.ts';
import { Domain } from '@sthrift/domain';
import { vi } from 'vitest';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'index.feature'));

// Mock the context implementations
vi.mock('./user/index.ts', () => ({
	UserContext: vi.fn(() => ({
		PersonalUser: {
			PersonalUserReadRepo: {},
		},
		AdminUser: {
			AdminUserReadRepo: {},
		},
		getUserById: vi.fn(),
		getUserByEmail: vi.fn(),
	})),
}));

vi.mock('./conversation/index.ts', () => ({
	ConversationContext: vi.fn(() => ({
		Conversation: {
			ConversationReadRepo: {},
		},
	})),
}));

vi.mock('./listing/index.ts', () => ({
	ListingContext: vi.fn(() => ({
		ItemListing: {
			ItemListingReadRepo: {},
		},
	})),
}));

vi.mock('./reservation-request/index.ts', () => ({
	ReservationRequestContext: vi.fn(() => ({
		ReservationRequest: {
			ReservationRequestReadRepo: {},
		},
	})),
}));

vi.mock('./appeal-request/index.ts', () => ({
	AppealRequestContext: vi.fn(() => ({
		ListingAppealRequest: {
			ListingAppealRequestReadRepo: {},
		},
		UserAppealRequest: {
			UserAppealRequestReadRepo: {},
		},
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
		'Creating ReadonlyDataSource with valid models and passport',
		({ Given, When, Then, And }) => {
			let readonlyDataSource: ReturnType<typeof ReadonlyDataSourceImplementation>;

			Given('the ModelsContext is valid', () => {
				expect(mockModelsContext).toBeDefined();
			});

			And('the Passport is valid', () => {
				expect(mockPassport).toBeDefined();
			});

			When('the ReadonlyDataSource is created', () => {
				readonlyDataSource = ReadonlyDataSourceImplementation(mockModelsContext, mockPassport);
			});

			Then('a ReadonlyDataSource object should be returned', () => {
				expect(readonlyDataSource).toBeDefined();
			});

			And('the ReadonlyDataSource should have a User property', () => {
				expect(readonlyDataSource.User).toBeDefined();
			});

			And('the ReadonlyDataSource should have a ReservationRequest property', () => {
				expect(readonlyDataSource.ReservationRequest).toBeDefined();
			});

			And('the ReadonlyDataSource should have a Listing property', () => {
				expect(readonlyDataSource.Listing).toBeDefined();
			});

			And('the ReadonlyDataSource should have a Conversation property', () => {
				expect(readonlyDataSource.Conversation).toBeDefined();
			});

			And('the ReadonlyDataSource should have an AppealRequest property', () => {
				expect(readonlyDataSource.AppealRequest).toBeDefined();
			});
		},
	);

	Scenario('ReadonlyDataSource context structure', ({ Given, When, Then, And }) => {
		let readonlyDataSource: ReturnType<typeof ReadonlyDataSourceImplementation>;

		Given('valid models and passport', () => {
			expect(mockModelsContext).toBeDefined();
			expect(mockPassport).toBeDefined();
		});

		When('the ReadonlyDataSource is created', () => {
			readonlyDataSource = ReadonlyDataSourceImplementation(mockModelsContext, mockPassport);
		});

		Then('User context should have PersonalUser and AdminUser', () => {
			expect(readonlyDataSource.User.PersonalUser).toBeDefined();
			expect(readonlyDataSource.User.AdminUser).toBeDefined();
		});

		And('ReservationRequest context should have ReservationRequest', () => {
			expect(readonlyDataSource.ReservationRequest.ReservationRequest).toBeDefined();
		});

		And('Listing context should have ItemListing', () => {
			expect(readonlyDataSource.Listing.ItemListing).toBeDefined();
		});

		And('Conversation context should have Conversation', () => {
			expect(readonlyDataSource.Conversation.Conversation).toBeDefined();
		});

		And('AppealRequest context should have ListingAppealRequest and UserAppealRequest', () => {
			expect(readonlyDataSource.AppealRequest.ListingAppealRequest).toBeDefined();
			expect(readonlyDataSource.AppealRequest.UserAppealRequest).toBeDefined();
		});
	});

	Scenario('ReadonlyDataSourceImplementation exports', ({ Then, And }) => {
		Then('the ReadonlyDataSourceImplementation function should be exported', () => {
			expect(ReadonlyDataSourceImplementation).toBeDefined();
			expect(typeof ReadonlyDataSourceImplementation).toBe('function');
		});

		And('the ReadonlyDataSource type should be exported', async () => {
			const module = await import('./index.ts');
			expect(module).toBeDefined();
		});
	});
});
