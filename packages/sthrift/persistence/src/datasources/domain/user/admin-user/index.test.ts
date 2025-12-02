import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as AdminUserIndex from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Background, Scenario }) => {
	let mockModels: never;
	let mockPassport: never;

	Background(({ Given, And }) => {
		Given('a valid models context with AdminUser model', () => {
			mockModels = {
				User: {
					AdminUser: {} as never,
				},
			} as never;
		});

		And('a valid passport for domain operations', () => {
			mockPassport = {} as never;
		});
	});

	Scenario('Creating Admin User Persistence', ({ When, Then, And }) => {
		let result: ReturnType<typeof AdminUserIndex.AdminUserPersistence>;

		When('I call AdminUserPersistence with models and passport', () => {
			result = AdminUserIndex.AdminUserPersistence(mockModels, mockPassport);
		});

		Then('I should receive an object with AdminUserUnitOfWork property', () => {
			expect(result).toBeDefined();
			expect(result.AdminUserUnitOfWork).toBeDefined();
		});

		And('the AdminUserUnitOfWork should be properly initialized', () => {
			expect(result.AdminUserUnitOfWork).toBeDefined();
		});
	});

	Scenario('AdminUserPersistence exports', ({ Then, And }) => {
		Then('AdminUserPersistence should be exported from index', () => {
			expect(AdminUserIndex.AdminUserPersistence).toBeDefined();
		});

		And('AdminUserPersistence should be a function', () => {
			expect(typeof AdminUserIndex.AdminUserPersistence).toBe('function');
		});
	});
});
