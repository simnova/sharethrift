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
	Scenario('Exports from readonly appeal request context index', ({ Then, And }) => {
		Then('the AppealRequestContext function should be exported', () => {
			expect(AppealRequestIndex.AppealRequestContext).toBeDefined();
		});

		And('AppealRequestContext should be a function', () => {
			expect(typeof AppealRequestIndex.AppealRequestContext).toBe('function');
		});
	});

	Scenario('Creating Appeal Request Read Context', ({ Given, And, When, Then }) => {
		let mockModels: ModelsContext;
		let mockPassport: Domain.Passport;
		let result: ReturnType<typeof AppealRequestIndex.AppealRequestContext>;

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

		When('I call AppealRequestContext with models and passport', () => {
			result = AppealRequestIndex.AppealRequestContext(mockModels, mockPassport);
		});

		Then('it should return an object with ListingAppealRequest property', () => {
			expect(result.ListingAppealRequest).toBeDefined();
		});

		And('it should return an object with UserAppealRequest property', () => {
			expect(result.UserAppealRequest).toBeDefined();
		});
	});
});
