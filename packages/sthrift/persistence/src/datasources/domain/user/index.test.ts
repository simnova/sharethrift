import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as UserIndex from './index.ts';
import type { ModelsContext } from '../../../models-context.ts';
import type { Domain } from '@sthrift/domain';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Scenario }) => {
	Scenario('Exports from user context index', ({ Then, And }) => {
		Then('the UserContextPersistence function should be exported', () => {
			expect(UserIndex.UserContextPersistence).toBeDefined();
		});

		And('UserContextPersistence should be a function', () => {
			expect(typeof UserIndex.UserContextPersistence).toBe('function');
		});
	});

	Scenario('Creating User Context Persistence', ({ Given, When, Then, And }) => {
		let mockModels: ModelsContext;
		let mockPassport: Domain.Passport;
		let result: ReturnType<typeof UserIndex.UserContextPersistence>;

		Given('a mock ModelsContext with User models', () => {
			mockModels = {
				User: {
					PersonalUser: {} as unknown,
					AdminUser: {} as unknown,
				},
			} as ModelsContext;
		});

		And('a mock Passport', () => {
			mockPassport = {} as Domain.Passport;
		});

		When('I call UserContextPersistence with models and passport', () => {
			result = UserIndex.UserContextPersistence(mockModels, mockPassport);
		});

		Then('it should return an object with PersonalUser property', () => {
			expect(result.PersonalUser).toBeDefined();
		});

		And('it should return an object with AdminUser property', () => {
			expect(result.AdminUser).toBeDefined();
		});
	});
});
