import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as AdminRoleIndex from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Background, Scenario }) => {
	let mockModels: never;
	let mockPassport: never;

	Background(({ Given, And }) => {
		Given('a valid models context with AdminRole model', () => {
			mockModels = {
				Role: {
					AdminRole: {} as never,
				},
			} as never;
		});

		And('a valid passport for domain operations', () => {
			mockPassport = {} as never;
		});
	});

	Scenario('Creating Admin Role Persistence', ({ When, Then, And }) => {
		let result: ReturnType<typeof AdminRoleIndex.AdminRolePersistence>;

		When('I call AdminRolePersistence with models and passport', () => {
			result = AdminRoleIndex.AdminRolePersistence(mockModels, mockPassport);
		});

		Then('I should receive an object with AdminRoleUnitOfWork property', () => {
			expect(result).toBeDefined();
			expect(result.AdminRoleUnitOfWork).toBeDefined();
		});

		And('the AdminRoleUnitOfWork should be properly initialized', () => {
			expect(result.AdminRoleUnitOfWork).toBeDefined();
		});
	});

	Scenario('AdminRolePersistence exports', ({ Then, And }) => {
		Then('AdminRolePersistence should be exported from index', () => {
			expect(AdminRoleIndex.AdminRolePersistence).toBeDefined();
		});

		And('AdminRolePersistence should be a function', () => {
			expect(typeof AdminRoleIndex.AdminRolePersistence).toBe('function');
		});
	});
});
