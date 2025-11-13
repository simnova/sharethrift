import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { Domain } from '@sthrift/domain';
import { expect, vi } from 'vitest';
import { getPersonalUserUnitOfWork } from './personal-user.uow.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.uow.feature'),
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
	let personalUserModel: Models.User.PersonalUserModelType;
	let passport: Domain.Passport;
	let result: unknown;

	BeforeEachScenario(() => {
		passport = makePassport();
		personalUserModel = {
			findOne: vi.fn(),
			find: vi.fn(),
			create: vi.fn(),
		} as unknown as Models.User.PersonalUserModelType;
		result = undefined;
	});

	Background(({ Given, And }) => {
		Given('a Mongoose context factory with a working service', () => {
			// Mock service is set up
		});
		And('a valid PersonalUser model from the models context', () => {
			// Model is set up in BeforeEachScenario
		});
		And('a valid passport for domain operations', () => {
			passport = makePassport();
		});
	});

	Scenario('Creating a PersonalUser Unit of Work', ({ When, Then, And }) => {
		When(
			'I call getPersonalUserUnitOfWork with the PersonalUser model and passport',
			() => {
				result = getPersonalUserUnitOfWork(personalUserModel, passport);
			},
		);
		Then(
			'I should receive a properly initialized PersonalUserUnitOfWork',
			() => {
				expect(result).toBeDefined();
				expect(result).toHaveProperty('withTransaction');
				expect(result).toHaveProperty('withScopedTransaction');
				expect(result).toHaveProperty('withScopedTransactionById');
			},
		);
		And('the Unit of Work should have the correct methods', () => {
			expect(typeof (result as { withTransaction: unknown }).withTransaction).toBe('function');
			expect(typeof (result as { withScopedTransaction: unknown }).withScopedTransaction).toBe('function');
			expect(typeof (result as { withScopedTransactionById: unknown }).withScopedTransactionById).toBe('function');
		});
	});
});
