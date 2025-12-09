import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { Domain } from '@sthrift/domain';
import { expect, vi } from 'vitest';
import type { MockedFunction } from 'vitest';
import type { ModelsContext } from '../../../../models-context.ts';
import { UserReadRepositoryImpl } from './user.read-repository.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/user.read-repository.feature'),
);

type QueryWithLean<T> = Promise<T> & {
	lean: MockedFunction<() => QueryWithLean<T>>;
	populate: MockedFunction<(...args: unknown[]) => QueryWithLean<T>>;
};

function createLeanQuery<T>(doc: T | null): QueryWithLean<T | null> {
	const base = Promise.resolve(doc) as QueryWithLean<T | null>;
	base.lean = vi.fn(() => base);
	base.populate = vi.fn(() => base);
	return base;
}
// Helper functions for scenario-specific mocks
function mockAllUsersNotFound(
	personalUserModel: Partial<Models.User.PersonalUserModelType>,
	adminUserModel: Partial<Models.User.AdminUserModelType>,
) {
	personalUserModel.findById = vi.fn(() =>
		createLeanQuery(null),
	) as unknown as Models.User.PersonalUserModelType['findById'];
	adminUserModel.findById = vi.fn(() =>
		createLeanQuery(null),
	) as unknown as Models.User.AdminUserModelType['findById'];
}

function mockAllEmailsNotFound(
	personalUserModel: Partial<Models.User.PersonalUserModelType>,
	adminUserModel: Partial<Models.User.AdminUserModelType>,
) {
	personalUserModel.findOne = vi.fn(() =>
		createLeanQuery(null),
	) as unknown as Models.User.PersonalUserModelType['findOne'];
	adminUserModel.findOne = vi.fn(() =>
		createLeanQuery(null),
	) as unknown as Models.User.AdminUserModelType['findOne'];
}

function makePassport(): Domain.Passport {
	return vi.mocked({
		user: {
			forPersonalUser: vi.fn(() => ({
				determineIf: () => true,
			})),
			forAdminUser: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
	} as unknown as Domain.Passport);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let repository: UserReadRepositoryImpl;
	let personalUserModel: Partial<Models.User.PersonalUserModelType>;
	let adminUserModel: Partial<Models.User.AdminUserModelType>;
	let passport: Domain.Passport;
	let result: Domain.Contexts.User.UserEntityReference | null | undefined;
	let personalUserId: string;
	let adminUserId: string;

	BeforeEachScenario(() => {
		const personalObjectId = new MongooseSeedwork.ObjectId();
		const adminObjectId = new MongooseSeedwork.ObjectId();
		personalUserId = personalObjectId.toHexString();
		adminUserId = adminObjectId.toHexString();
		passport = makePassport();
		const personalDocument = {
			_id: personalObjectId,
			id: personalUserId,
			userType: 'personal-user',
			isBlocked: false,
			account: {
				accountType: 'standard',
				email: 'personal@example.com',
				username: 'personaluser',
				profile: {
					firstName: 'Personal',
					lastName: 'User',
					aboutMe: 'Personal user',
					location: {},
					billing: {},
				},
			},
			createdAt: new Date('2020-01-01'),
			updatedAt: new Date('2020-01-02'),
		};
		personalUserModel = {
			findById: vi.fn(() =>
				createLeanQuery(personalDocument),
			) as unknown as Models.User.PersonalUserModelType['findById'],
			findOne: vi.fn(() =>
				createLeanQuery(personalDocument),
			) as unknown as Models.User.PersonalUserModelType['findOne'],
		};
		const adminDocument = {
			_id: adminObjectId,
			id: adminUserId,
			userType: 'admin-user',
			isBlocked: false,
			account: {
				accountType: 'admin',
				email: 'admin@example.com',
				username: 'adminuser',
				profile: {
					firstName: 'Admin',
					lastName: 'User',
					aboutMe: 'Admin user',
					location: {},
					billing: {},
				},
			},
			createdAt: new Date('2020-01-01'),
			updatedAt: new Date('2020-01-02'),
			role: { id: 'role-1', roleName: 'Admin' },
		};
		adminUserModel = {
			findById: vi.fn(() =>
				createLeanQuery(adminDocument),
			) as unknown as Models.User.AdminUserModelType['findById'],
			findOne: vi.fn(() =>
				createLeanQuery(adminDocument),
			) as unknown as Models.User.AdminUserModelType['findOne'],
		};
		const userModel = {
			findById: vi.fn((id: string) => {
				if (id === personalUserId) return createLeanQuery(personalDocument);
				if (id === adminUserId) return createLeanQuery(adminDocument);
				return createLeanQuery(null);
			}) as unknown as Models.User.UserModelType['findById'],
			findOne: vi.fn((filter: { 'account.email': string }) => {
				const email = filter['account.email'];
				if (email === 'personal@example.com')
					return createLeanQuery(personalDocument);
				if (email === 'admin@example.com')
					return createLeanQuery(adminDocument);
				return createLeanQuery(null);
			}) as unknown as Models.User.UserModelType['findOne'],
		};
		const modelsContext = {
			User: {
				PersonalUser: personalUserModel,
				AdminUser: adminUserModel,
				User: userModel,
			},
		} as unknown as ModelsContext;
		repository = new UserReadRepositoryImpl(modelsContext, passport);
		result = undefined;
	});

	Background(({ Given, And }) => {
		Given(
			'a UserReadRepository instance with working data sources and passport',
			() => {
				// Already set up in BeforeEachScenario
			},
		);
		And(
			'valid PersonalUser and AdminUser documents exist in the database',
			() => {
				// Mock documents are set up in BeforeEachScenario
			},
		);
	});

	Scenario('Getting a user by ID (personal)', ({ When, Then }) => {
		When('I call getById with a personal user ID', async () => {
			result = await repository.getById(personalUserId);
		});
		Then('I should receive a PersonalUser domain object', () => {
			expect(result).toBeDefined();
			expect(result?.userType).toBe('personal-user');
		});
	});

	Scenario('Getting a user by ID (admin)', ({ When, Then }) => {
		When('I call getById with an admin user ID', async () => {
			result = await repository.getById(adminUserId);
		});
		Then('I should receive an AdminUser domain object', () => {
			expect(result).toBeDefined();
			expect(result?.userType).toBe('admin-user');
		});
	});

	Scenario('Getting a user by ID that does not exist', ({ When, Then }) => {
		When('I call getById with a non-existent user ID', async () => {
			mockAllUsersNotFound(personalUserModel, adminUserModel);
			result = await repository.getById('nonexistent-id');
		});
		Then('I should receive null', () => {
			expect(result).toBeNull();
		});
	});

	Scenario('Getting a user by email (personal)', ({ When, Then }) => {
		When('I call getByEmail with a personal user email', async () => {

			result = await repository.getByEmail('personal@example.com');
		});
		Then('I should receive a PersonalUser domain object', () => {
			expect(result).toBeDefined();
			expect(result?.userType).toBe('personal-user');
		});
	});

	Scenario('Getting a user by email (admin)', ({ When, Then }) => {
		When('I call getByEmail with an admin user email', async () => {
			result = await repository.getByEmail('admin@example.com');
		});
		Then('I should receive an AdminUser domain object', () => {
			expect(result).toBeDefined();
			expect(result?.userType).toBe('admin-user');
		});
	});

	Scenario('Getting a user by email that does not exist', ({ When, Then }) => {
		When('I call getByEmail with a non-existent user email', async () => {
			mockAllEmailsNotFound(personalUserModel, adminUserModel);
			result = await repository.getByEmail('nonexistent@example.com');
		});
		Then('I should receive null', () => {
			expect(result).toBeNull();
		});
	});
});
