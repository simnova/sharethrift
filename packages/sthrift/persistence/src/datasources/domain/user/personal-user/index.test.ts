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

	Scenario('Creating Personal User Persistence', ({ When, Then, And }) => {
		let result: ReturnType<typeof PersonalUserIndex.PersonalUserPersistence>;

		When('I call PersonalUserPersistence with models and passport', () => {
			result = PersonalUserIndex.PersonalUserPersistence(mockModels, mockPassport);
		});

		Then('I should receive an object with PersonalUserUnitOfWork property', () => {
			expect(result).toBeDefined();
			expect(result.PersonalUserUnitOfWork).toBeDefined();
		});

		And('the PersonalUserUnitOfWork should be properly initialized', () => {
			expect(result.PersonalUserUnitOfWork).toBeDefined();
		});
	});

	Scenario('PersonalUserPersistence exports', ({ Then, And }) => {
		Then('PersonalUserPersistence should be exported from index', () => {
			expect(PersonalUserIndex.PersonalUserPersistence).toBeDefined();
		});

		And('PersonalUserPersistence should be a function', () => {
			expect(typeof PersonalUserIndex.PersonalUserPersistence).toBe('function');
		});
	});
});
