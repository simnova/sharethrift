import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { SendGrid } from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/index.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Exporting SendGrid as default', ({ When, Then }) => {
		let DefaultExport: typeof SendGrid;

		When('I import the default export from the index', () => {
			DefaultExport = SendGrid;
		});

		Then('it should be the SendGrid class', () => {
			expect(DefaultExport).toBeDefined();
			expect(typeof DefaultExport).toBe('function');
			expect(DefaultExport.name).toBe('SendGrid');
		});
	});
});
