import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as AppealRequestIndex from './index.ts';
import type { ModelsContext } from '../../../models-context.ts';
import type { Domain } from '@sthrift/domain';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Scenario }) => {
	Scenario('Exports from appeal request context index', ({ Then, And }) => {
		Then('the AppealRequestContextPersistence function should be exported', () => {
			expect(AppealRequestIndex.AppealRequestContextPersistence).toBeDefined();
		});

		And('AppealRequestContextPersistence should be a function', () => {
			expect(typeof AppealRequestIndex.AppealRequestContextPersistence).toBe('function');
		});

		And('ListingAppealRequest namespace should be exported', () => {
			expect(AppealRequestIndex.ListingAppealRequest).toBeDefined();
		});

		And('UserAppealRequest namespace should be exported', () => {
			expect(AppealRequestIndex.UserAppealRequest).toBeDefined();
		});
	});

	Scenario('Creating Appeal Request Context Persistence', ({ Given, When, Then, And }) => {
		let mockModels: ModelsContext;
		let mockPassport: Domain.Passport;
		let result: ReturnType<typeof AppealRequestIndex.AppealRequestContextPersistence>;

		Given('a mock ModelsContext with AppealRequest models', () => {
			mockModels = {
				AppealRequest: {
					ListingAppealRequest: {} as unknown,
					UserAppealRequest: {} as unknown,
				},
			} as ModelsContext;
		});

		And('a mock Passport', () => {
			mockPassport = {} as Domain.Passport;
		});

		When('I call AppealRequestContextPersistence with models and passport', () => {
			result = AppealRequestIndex.AppealRequestContextPersistence(mockModels, mockPassport);
		});

		Then('it should return an object with ListingAppealRequest property', () => {
			expect(result.ListingAppealRequest).toBeDefined();
		});

		And('it should return an object with UserAppealRequest property', () => {
			expect(result.UserAppealRequest).toBeDefined();
		});

		And('ListingAppealRequest should have ListingAppealRequestUnitOfWork', () => {
			expect(result.ListingAppealRequest.ListingAppealRequestUnitOfWork).toBeDefined();
		});

		And('UserAppealRequest should have UserAppealRequestUnitOfWork', () => {
			expect(result.UserAppealRequest.UserAppealRequestUnitOfWork).toBeDefined();
		});
	});
});
