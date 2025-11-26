import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as ReservationRequestIndex from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Scenario }) => {
	Scenario('Exports from reservation request index', ({ Then, And }) => {
		Then('the ReservationRequestPersistence function should be exported', () => {
			expect(ReservationRequestIndex.ReservationRequestPersistence).toBeDefined();
		});

		And('ReservationRequestPersistence should be a function', () => {
			expect(typeof ReservationRequestIndex.ReservationRequestPersistence).toBe('function');
		});
	});
});
