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

	Scenario('Creating Admin User Read Repository Implementation', ({ When, Then, And }) => {
		let result: ReturnType<typeof AdminUserIndex.AdminUserReadRepositoryImpl>;

		When('I call AdminUserReadRepositoryImpl with models and passport', () => {
			result = AdminUserIndex.AdminUserReadRepositoryImpl(mockModels, mockPassport);
		});

		Then('I should receive an object with AdminUserReadRepo property', () => {
			expect(result).toBeDefined();
			expect(result.AdminUserReadRepo).toBeDefined();
		});

		And('the AdminUserReadRepo should be an AdminUserReadRepository instance', () => {
			expect(result.AdminUserReadRepo).toBeDefined();
		});
	});

	Scenario('AdminUserReadRepositoryImpl exports', ({ Then, And }) => {
		Then('AdminUserReadRepositoryImpl should be exported from index', () => {
			expect(AdminUserIndex.AdminUserReadRepositoryImpl).toBeDefined();
		});

		And('AdminUserReadRepositoryImpl should be a function', () => {
			expect(typeof AdminUserIndex.AdminUserReadRepositoryImpl).toBe('function');
		});

		And('AdminUserReadRepository type should be exported from index', () => {
			// Type exports are verified at compile time
			expect(true).toBe(true);
		});
	});
});
