import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { Domain } from '@sthrift/domain';
import type mongoose from 'mongoose';
import { expect, vi } from 'vitest';
import { makeNewableMock } from '@cellix/test-utils';
import { AdminUserConverter } from './admin-user.domain-adapter.ts';
import { AdminUserRepository } from './admin-user.repository.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-user.repository.feature'),
);

function makePassport(): Domain.Passport {
	return vi.mocked({
		user: {
			forAdminUser: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
	} as unknown as Domain.Passport);
}

function makeEventBus(): DomainSeedwork.EventBus {
	return vi.mocked({
		dispatch: vi.fn(),
		register: vi.fn(),
	} as DomainSeedwork.EventBus);
}

// use shared makeNewableMock from test-utils

function makeSession(): mongoose.ClientSession {
	return vi.mocked({} as mongoose.ClientSession);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let repository: AdminUserRepository<Domain.Contexts.User.AdminUser.AdminUserProps>;
	let mockModel: Models.User.AdminUserModelType;
	let passport: Domain.Passport;
	let mockDoc: Models.User.AdminUser;
	let eventBus: DomainSeedwork.EventBus;
	let session: mongoose.ClientSession;
	let result: unknown;

	BeforeEachScenario(() => {
		passport = makePassport();
		eventBus = makeEventBus();
		session = makeSession();
		mockDoc = {
			_id: 'admin-user-1',
			id: 'admin-user-1',
			userType: 'admin-users',
			isBlocked: false,
			account: {
				accountType: 'admin',
				email: 'admin@example.com',
				username: 'adminuser',
				profile: {
					firstName: 'Admin',
					lastName: 'User',
					aboutMe: 'Admin bio',
					location: {
						address1: '123 Admin St',
						address2: null,
						city: 'Admin City',
						state: 'CA',
						country: 'USA',
						zipCode: '90210',
					},
				},
			},
			role: {
				id: 'role-1',
			},
			populate: vi.fn(() => {
				return Promise.resolve(mockDoc);
			}),
			set: vi.fn(),
		} as unknown as Models.User.AdminUser;

		mockModel = {
			findOne: vi.fn(() => ({
				exec: vi.fn(async () => mockDoc),
			})),
		} as unknown as Models.User.AdminUserModelType;

		repository = new AdminUserRepository(
			passport,
			mockModel,
			new AdminUserConverter(),
			eventBus,
			session,
		);
		result = undefined;
	});

	Background(({ Given, And }) => {
		Given(
			'an AdminUserRepository instance with a working Mongoose model, type converter, and passport',
			() => {
				// Already set up in BeforeEachScenario
			},
		);
		And('valid AdminUser documents exist in the database', () => {
			// Mock documents are set up in BeforeEachScenario
		});
	});

	Scenario('Getting an admin user by ID', ({ Given, When, Then, And }) => {
		Given(
			'an AdminUser document with id "admin-user-1", email "admin@example.com", and firstName "Admin"',
			() => {
				// Already set up in BeforeEachScenario
			},
		);
		When('I call getById with "admin-user-1"', async () => {
			result = await repository.getById('admin-user-1');
		});
		Then('I should receive an AdminUser domain object', () => {
			expect(result).toBeInstanceOf(Domain.Contexts.User.AdminUser.AdminUser);
		});
		And('the domain object\'s email should be "admin@example.com"', () => {
			expect(
				(
					result as Domain.Contexts.User.AdminUser.AdminUser<Domain.Contexts.User.AdminUser.AdminUserProps>
				).account.email,
			).toBe('admin@example.com');
		});
		And('the domain object\'s firstName should be "Admin"', () => {
			expect(
				(
					result as Domain.Contexts.User.AdminUser.AdminUser<Domain.Contexts.User.AdminUser.AdminUserProps>
				).account.profile.firstName,
			).toBe('Admin');
		});
	});

	Scenario('Getting an admin user by a nonexistent ID', ({ When, Then }) => {
		When('I call getById with "nonexistent-id"', () => {
			mockModel = {
				findOne: vi.fn(() => ({
					exec: vi.fn(() => Promise.resolve(null)),
				})),
			} as unknown as Models.User.AdminUserModelType;
			repository = new AdminUserRepository(
				passport,
				mockModel,
				new AdminUserConverter(),
				eventBus,
				session,
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
	});

	Scenario('Creating a new admin user instance', ({ When, Then, And }) => {
		When(
			'I call getNewInstance with email "newadmin@example.com", username "newadmin", firstName "New", and lastName "Admin"',
			async () => {
				const newDoc = { ...mockDoc };
				const ModelConstructor = makeNewableMock(() => newDoc);
				Object.assign(ModelConstructor, {
					findOne: mockModel.findOne,
					findById: mockModel.findById,
				});

				repository = new AdminUserRepository(
					passport,
					ModelConstructor as unknown as Models.User.AdminUserModelType,
					new AdminUserConverter(),
					eventBus,
					session,
				);
				result = await repository.getNewInstance(
					'newadmin@example.com',
					'newadmin',
					'New',
					'Admin',
				);
			},
		);
		Then('I should receive a new AdminUser domain object', () => {
			expect(result).toBeInstanceOf(Domain.Contexts.User.AdminUser.AdminUser);
		});
		And('the domain object\'s email should be "newadmin@example.com"', () => {
			expect(
				(
					result as Domain.Contexts.User.AdminUser.AdminUser<Domain.Contexts.User.AdminUser.AdminUserProps>
				).account.email,
			).toBe('newadmin@example.com');
		});
		And('the domain object\'s firstName should be "New"', () => {
			expect(
				(
					result as Domain.Contexts.User.AdminUser.AdminUser<Domain.Contexts.User.AdminUser.AdminUserProps>
				).account.profile.firstName,
			).toBe('New');
		});
		And('the domain object\'s lastName should be "Admin"', () => {
			expect(
				(
					result as Domain.Contexts.User.AdminUser.AdminUser<Domain.Contexts.User.AdminUser.AdminUserProps>
				).account.profile.lastName,
			).toBe('Admin');
		});
	});
});
