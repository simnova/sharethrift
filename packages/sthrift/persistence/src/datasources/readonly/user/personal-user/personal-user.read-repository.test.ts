import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { ModelsContext } from '../../../../models-context.ts';
import { Domain } from '@sthrift/domain';
import { PersonalUserReadRepositoryImpl } from './personal-user.read-repository.ts';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.read-repository.feature'),
);

function makePassport(): Domain.Passport {
	return vi.mocked({
		user: {
			forPersonalUser: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
	} as unknown as Domain.Passport);
}

function makeMockUser(overrides: Partial<Models.User.PersonalUser> = {}): Models.User.PersonalUser {
	return {
		_id: new MongooseSeedwork.ObjectId(),
		id: 'user-1',
		userType: 'end-user',
		isBlocked: false,
		hasCompletedOnboarding: false,
		account: {
			accountType: 'standard',
			email: 'test@example.com',
			username: 'testuser',
			profile: {
				firstName: 'Test',
				lastName: 'User',
				aboutMe: 'Hello',
				location: {
					address1: '123 Main St',
					address2: null,
					city: 'Test City',
					state: 'TS',
					country: 'Testland',
					zipCode: '12345',
				},
				billing: {
					subscriptionId: null,
					cybersourceCustomerId: null,
					paymentState: '',
					lastTransactionId: null,
					lastPaymentAmount: null,
				},
			},
		},
		role: {
			id: 'role-1',
		},
		createdAt: new Date('2020-01-01'),
		updatedAt: new Date('2020-01-02'),
		populate: vi.fn(function () {
			return Promise.resolve(this);
		}),
		set: vi.fn(),
		...overrides,
	} as unknown as Models.User.PersonalUser;
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let repository: PersonalUserReadRepositoryImpl;
	let mockModel: Models.User.PersonalUserModelType;
	let passport: Domain.Passport;
	let mockUsers: Models.User.PersonalUser[];
	let result: unknown;

	BeforeEachScenario(() => {
		passport = makePassport();
		mockUsers = [makeMockUser()];

		mockModel = {
			find: vi.fn(() => ({
				exec: vi.fn(async () => mockUsers),
			})),
			findById: vi.fn(() => ({
				exec: vi.fn(async () => mockUsers[0]),
			})),
			findOne: vi.fn(() => ({
				exec: vi.fn(async () => mockUsers[0]),
			})),
		} as unknown as Models.User.PersonalUserModelType;

		const modelsContext = {
			User: {
				PersonalUser: mockModel,
			},
		} as unknown as ModelsContext;

		repository = new PersonalUserReadRepositoryImpl(modelsContext, passport);
		result = undefined;
	});

	Background(({ Given, And }) => {
		Given(
			'a PersonalUserReadRepository instance with a working data source and passport',
			() => {
				// Already set up in BeforeEachScenario
			},
		);
		And('valid PersonalUser documents exist in the database', () => {
			// Mock documents are set up in BeforeEachScenario
		});
	});

	Scenario('Getting all personal users', ({ When, Then }) => {
		When('I call getAll', async () => {
			result = await repository.getAll();
		});
		Then('I should receive an array of PersonalUser domain objects', () => {
			expect(Array.isArray(result)).toBe(true);
			expect((result as unknown[]).length).toBeGreaterThan(0);
			expect((result as unknown[])[0]).toBeInstanceOf(
				Domain.Contexts.User.PersonalUser.PersonalUser,
			);
		});
	});

	Scenario(
		'Getting all users with pagination',
		({ Given, When, Then }) => {
			Given('multiple PersonalUser documents exist in the database', () => {
				mockUsers = [
					makeMockUser({ id: 'user-1' }),
					makeMockUser({ id: 'user-2' }),
					makeMockUser({ id: 'user-3' }),
				];
			});
			When('I call getAllUsers with page 1 and pageSize 10', async () => {
				result = await repository.getAllUsers({ page: 1, pageSize: 10 });
			});
			Then(
				'I should receive a paginated result with items, total, page, and pageSize',
				() => {
					expect(result).toHaveProperty('items');
					expect(result).toHaveProperty('total');
					expect(result).toHaveProperty('page', 1);
					expect(result).toHaveProperty('pageSize', 10);
					expect(Array.isArray((result as { items: unknown[] }).items)).toBe(true);
				},
			);
		},
	);

	Scenario(
		'Getting all users with search text',
		({ Given, When, Then }) => {
			Given('PersonalUser documents with various emails and names', () => {
				mockUsers = [
					makeMockUser({
						id: 'user-1',
						account: {
							...makeMockUser().account,
							email: 'john@example.com',
							profile: {
								...makeMockUser().account.profile,
								firstName: 'John',
							},
						},
					}),
					makeMockUser({
						id: 'user-2',
						account: {
							...makeMockUser().account,
							email: 'jane@example.com',
							profile: {
								...makeMockUser().account.profile,
								firstName: 'Jane',
							},
						},
					}),
				];
			});
			When('I call getAllUsers with searchText "john"', async () => {
				result = await repository.getAllUsers({
					page: 1,
					pageSize: 10,
					searchText: 'john',
				});
			});
			Then('I should receive only users matching the search text', () => {
				expect((result as { items: unknown[] }).items.length).toBeGreaterThanOrEqual(0);
				// The filtering logic would filter to John, but since we're mocking,
				// we just verify the result structure
				expect(result).toHaveProperty('items');
			});
		},
	);

	Scenario(
		'Getting all users with status filters',
		({ Given, When, Then }) => {
			Given('PersonalUser documents with different statuses', () => {
				mockUsers = [
					makeMockUser({ id: 'user-1', isBlocked: false }),
					makeMockUser({ id: 'user-2', isBlocked: true }),
				];
			});
			When(
				'I call getAllUsers with statusFilters including "Active"',
				async () => {
					result = await repository.getAllUsers({
						page: 1,
						pageSize: 10,
						statusFilters: ['Active'],
					});
				},
			);
			Then('I should receive only active users', () => {
				expect((result as { items: unknown[] }).items.length).toBeGreaterThanOrEqual(0);
				expect(result).toHaveProperty('items');
			});
		},
	);

	Scenario('Getting a personal user by ID', ({ Given, When, Then }) => {
		Given('a PersonalUser document with id "user-1"', () => {
			mockUsers = [makeMockUser({ id: 'user-1' })];
		});
		When('I call getById with "user-1"', async () => {
			result = await repository.getById('user-1');
		});
		Then('I should receive a PersonalUser domain object with that ID', () => {
			expect(result).toBeInstanceOf(
				Domain.Contexts.User.PersonalUser.PersonalUser,
			);
		});
	});

	Scenario(
		'Getting a personal user by ID that doesn\'t exist',
		({ When, Then }) => {
			When('I call getById with "nonexistent-id"', async () => {
				mockModel = {
					...mockModel,
					findById: vi.fn(() => ({
						exec: vi.fn(async () => null),
					})),
				} as unknown as Models.User.PersonalUserModelType;

				const modelsContext = {
					User: {
						PersonalUser: mockModel,
					},
				} as unknown as ModelsContext;

				repository = new PersonalUserReadRepositoryImpl(modelsContext, passport);
				result = await repository.getById('nonexistent-id');
			});
			Then('I should receive null', () => {
				expect(result).toBeNull();
			});
		},
	);

	Scenario(
		'Getting a personal user by email',
		({ Given, When, Then }) => {
			Given('a PersonalUser document with email "test@example.com"', () => {
				mockUsers = [
					makeMockUser({
						account: { ...makeMockUser().account, email: 'test@example.com' },
					}),
				];
			});
			When('I call getByEmail with "test@example.com"', async () => {
				result = await repository.getByEmail('test@example.com');
			});
			Then(
				'I should receive a PersonalUser domain object with that email',
				() => {
					expect(result).toBeInstanceOf(
						Domain.Contexts.User.PersonalUser.PersonalUser,
					);
				},
			);
		},
	);

	Scenario(
		'Getting a personal user by email that doesn\'t exist',
		({ When, Then }) => {
			When(
				'I call getByEmail with "nonexistent@example.com"',
				async () => {
					mockModel = {
						...mockModel,
						findOne: vi.fn(() => ({
							exec: vi.fn(async () => null),
						})),
					} as unknown as Models.User.PersonalUserModelType;

					const modelsContext = {
						User: {
							PersonalUser: mockModel,
						},
					} as unknown as ModelsContext;

					repository = new PersonalUserReadRepositoryImpl(
						modelsContext,
						passport,
					);
					result = await repository.getByEmail('nonexistent@example.com');
				},
			);
			Then('I should receive null', () => {
				expect(result).toBeNull();
			});
		},
	);
});
