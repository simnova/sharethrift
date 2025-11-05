import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi, beforeEach, afterEach } from 'vitest';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { Domain } from '@sthrift/domain';
import { PersonalUserRepository } from './personal-user.repository.ts';
import { PersonalUserConverter } from './personal-user.domain-adapter.ts';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.repository.feature'),
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

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let repository: PersonalUserRepository<Domain.Contexts.User.PersonalUser.PersonalUserProps>;
	let mockModel: Models.User.PersonalUserModelType;
	let passport: Domain.Passport;
	let mockDoc: Models.User.PersonalUser;
	let result: unknown;

	BeforeEachScenario(() => {
		passport = makePassport();
		mockDoc = {
			_id: 'user-1',
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
			populate: vi.fn(async function () {
				return this;
			}),
			set: vi.fn(),
		} as unknown as Models.User.PersonalUser;

		mockModel = {
			findOne: vi.fn(() => ({
				exec: vi.fn(async () => mockDoc),
			})),
		} as unknown as Models.User.PersonalUserModelType;

		repository = new PersonalUserRepository(
			mockModel,
			new PersonalUserConverter(),
			passport,
		);
		result = undefined;
	});

	Background(({ Given, And }) => {
		Given(
			'a PersonalUserRepository instance with a working Mongoose model, type converter, and passport',
			() => {
				// Already set up in BeforeEachScenario
			},
		);
		And('valid PersonalUser documents exist in the database', () => {
			// Mock documents are set up in BeforeEachScenario
		});
	});

	Scenario(
		'Getting a personal user by ID',
		({ Given, When, Then, And }) => {
			Given(
				'a PersonalUser document with id "user-1", email "test@example.com", and firstName "Test"',
				() => {
					// Already set up in BeforeEachScenario
				},
			);
			When('I call getById with "user-1"', async () => {
				result = await repository.getById('user-1');
			});
			Then('I should receive a PersonalUser domain object', () => {
				expect(result).toBeInstanceOf(
					Domain.Contexts.User.PersonalUser.PersonalUser,
				);
			});
			And('the domain object\'s email should be "test@example.com"', () => {
				expect(
					(
						result as Domain.Contexts.User.PersonalUser.PersonalUser<Domain.Contexts.User.PersonalUser.PersonalUserProps>
					).account.email,
				).toBe('test@example.com');
			});
			And('the domain object\'s firstName should be "Test"', () => {
				expect(
					(
						result as Domain.Contexts.User.PersonalUser.PersonalUser<Domain.Contexts.User.PersonalUser.PersonalUserProps>
					).account.profile.firstName,
				).toBe('Test');
			});
		},
	);

	Scenario(
		'Getting a personal user by a nonexistent ID',
		({ When, Then }) => {
			When('I call getById with "nonexistent-id"', async () => {
				mockModel = {
					findOne: vi.fn(() => ({
						exec: vi.fn(async () => null),
					})),
				} as unknown as Models.User.PersonalUserModelType;
				repository = new PersonalUserRepository(
					mockModel,
					new PersonalUserConverter(),
					passport,
				);
			});
			Then(
				'an error should be thrown indicating "User with id nonexistent-id not found"',
				async () => {
					await expect(repository.getById('nonexistent-id')).rejects.toThrow(
						'User with id nonexistent-id not found',
					);
				},
			);
		},
	);

	Scenario(
		'Creating a new personal user instance',
		({ When, Then, And }) => {
			When(
				'I call getNewInstance with email "new@example.com", firstName "New", and lastName "User"',
				async () => {
					const newDoc = { ...mockDoc };
					mockModel = {
						...mockModel,
						constructor: vi.fn(() => newDoc),
					} as unknown as Models.User.PersonalUserModelType;
					// Override the mockModel with a constructor function
					const ModelConstructor = function () {
						return newDoc;
					};
					Object.setPrototypeOf(
						ModelConstructor,
						mockModel as Models.User.PersonalUserModelType,
					);
					repository = new PersonalUserRepository(
						ModelConstructor as unknown as Models.User.PersonalUserModelType,
						new PersonalUserConverter(),
						passport,
					);
					result = await repository.getNewInstance(
						'new@example.com',
						'New',
						'User',
					);
				},
			);
			Then('I should receive a new PersonalUser domain object', () => {
				expect(result).toBeInstanceOf(
					Domain.Contexts.User.PersonalUser.PersonalUser,
				);
			});
			And('the domain object\'s email should be "new@example.com"', () => {
				expect(
					(
						result as Domain.Contexts.User.PersonalUser.PersonalUser<Domain.Contexts.User.PersonalUser.PersonalUserProps>
					).account.email,
				).toBe('new@example.com');
			});
			And('the domain object\'s firstName should be "New"', () => {
				expect(
					(
						result as Domain.Contexts.User.PersonalUser.PersonalUser<Domain.Contexts.User.PersonalUser.PersonalUserProps>
					).account.profile.firstName,
				).toBe('New');
			});
			And('the domain object\'s lastName should be "User"', () => {
				expect(
					(
						result as Domain.Contexts.User.PersonalUser.PersonalUser<Domain.Contexts.User.PersonalUser.PersonalUserProps>
					).account.profile.lastName,
				).toBe('User');
			});
		},
	);
});
