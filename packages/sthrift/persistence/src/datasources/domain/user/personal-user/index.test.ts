import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as PersonalUserIndex from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Scenario }) => {
	Scenario('Exports from personal user entity index', ({ Then, And }) => {
		Then('the PersonalUserPersistence function should be exported', () => {
			expect(PersonalUserIndex.PersonalUserPersistence).toBeDefined();
		});

		And('PersonalUserPersistence should be a function', () => {
			expect(typeof PersonalUserIndex.PersonalUserPersistence).toBe('function');
		});
	});
});
