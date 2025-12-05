import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as UserAppealRequestIndex from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Scenario }) => {
	Scenario('Exports from user-appeal-request index', ({ Then, And }) => {
		Then('the UserAppealRequestConverter should be exported', () => {
			expect(UserAppealRequestIndex.UserAppealRequestConverter).toBeDefined();
		});

		And('the UserAppealRequestDomainAdapter should be exported', () => {
			expect(UserAppealRequestIndex.UserAppealRequestDomainAdapter).toBeDefined();
		});

		And('the UserAppealRequestRepository should be exported', () => {
			expect(UserAppealRequestIndex.UserAppealRequestRepository).toBeDefined();
		});

		And('the getUserAppealRequestUnitOfWork function should be exported', () => {
			expect(UserAppealRequestIndex.getUserAppealRequestUnitOfWork).toBeDefined();
			expect(typeof UserAppealRequestIndex.getUserAppealRequestUnitOfWork).toBe('function');
		});
	});
});
