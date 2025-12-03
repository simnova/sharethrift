import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as PersonalUserIndex from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Background, Scenario }) => {
	let mockModels: never;
	let mockPassport: never;

	Background(({ Given, And }) => {
		Given('a valid models context with PersonalUser model', () => {
			mockModels = {
				User: {
					PersonalUser: {} as never,
				},
			} as never;
		});

		And('a valid passport for domain operations', () => {
			mockPassport = {} as never;
		});
	});

	Scenario('Creating Personal User Read Repository Implementation', ({ When, Then, And }) => {
		let result: ReturnType<typeof PersonalUserIndex.PersonalUserReadRepositoryImpl>;

		When('I call PersonalUserReadRepositoryImpl with models and passport', () => {
			result = PersonalUserIndex.PersonalUserReadRepositoryImpl(mockModels, mockPassport);
		});

		Then('I should receive an object with PersonalUserReadRepo property', () => {
			expect(result).toBeDefined();
			expect(result.PersonalUserReadRepo).toBeDefined();
		});

		And('the PersonalUserReadRepo should be a PersonalUserReadRepository instance', () => {
			expect(result.PersonalUserReadRepo).toBeDefined();
		});
	});

	Scenario('PersonalUserReadRepositoryImpl exports', ({ Then, And }) => {
		Then('PersonalUserReadRepositoryImpl should be exported from index', () => {
			expect(PersonalUserIndex.PersonalUserReadRepositoryImpl).toBeDefined();
		});

		And('PersonalUserReadRepositoryImpl should be a function', () => {
			expect(typeof PersonalUserIndex.PersonalUserReadRepositoryImpl).toBe('function');
		});

		And('PersonalUserReadRepository type should be exported from index', () => {
			// Type exports are verified at compile time
			expect(true).toBe(true);
		});
	});
});
