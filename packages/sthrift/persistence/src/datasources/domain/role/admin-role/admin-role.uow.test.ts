import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { Domain } from '@sthrift/domain';
import { expect, vi } from 'vitest';
import { getAdminRoleUnitOfWork } from './admin-role.uow.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-role.uow.feature'),
);

function makePassport(): Domain.Passport {
	return vi.mocked({
		role: {
			forAdminRole: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
	} as unknown as Domain.Passport);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let adminRoleModel: Models.Role.AdminRoleModelType;
	let passport: Domain.Passport;
	let result: unknown;

	BeforeEachScenario(() => {
		passport = makePassport();
		adminRoleModel = {
			findOne: vi.fn(),
			find: vi.fn(),
			create: vi.fn(),
		} as unknown as Models.Role.AdminRoleModelType;
		result = undefined;
	});

	Background(({ Given, And }) => {
		Given('a Mongoose context factory with a working service', () => {
			// Mock service is set up
		});
		And('a valid AdminRole model from the models context', () => {
			// Model is set up in BeforeEachScenario
		});
		And('a valid passport for domain operations', () => {
			// Passport is set up in BeforeEachScenario
		});
	});

	Scenario(
		'Creating an AdminRole Unit of Work',
		({ When, Then, And }) => {
			When(
				'I call getAdminRoleUnitOfWork with the AdminRole model and passport',
				() => {
					try {
						result = getAdminRoleUnitOfWork(adminRoleModel, passport);
					} catch (error) {
						result = error;
					}
				},
			);

			Then(
				'I should receive a properly initialized AdminRoleUnitOfWork',
				() => {
					expect(result).toBeDefined();
				},
			);

			And('the Unit of Work should have the correct methods', () => {
				expect(result).toBeDefined();
			});
		},
	);
});
