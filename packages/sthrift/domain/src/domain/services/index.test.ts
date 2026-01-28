import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import type { Services } from './index.ts';
import type { BlobStorage } from './blob-storage.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/index.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Services interface should define BlobStorage', ({ Given, When, Then }) => {
		let servicesInterface: Services;

		Given('I have the Services interface', () => {
			// Create mock implementation
			const mockBlobStorage: BlobStorage = {
				createValetKey: (_storageAccount: string, _path: string, _expiration: Date) => {
					return Promise.resolve('mock-valet-key');
				},
			};
			servicesInterface = {
				BlobStorage: mockBlobStorage,
			};
		});

		When('I check the interface properties', () => {
			// Check properties
		});

		Then('it should have BlobStorage property', () => {
			expect(servicesInterface).toBeDefined();
			expect(servicesInterface.BlobStorage).toBeDefined();
		});
	});

	Scenario('Services interface can be implemented', ({ Given, When, Then }) => {
		let implementation: Services;

		Given('I create a Services implementation', () => {
			const mockBlobStorage: BlobStorage = {
				createValetKey: (storageAccount: string, path: string, expiration: Date) => {
					expect(storageAccount).toBeDefined();
					expect(path).toBeDefined();
					expect(expiration).toBeDefined();
					return Promise.resolve(`valet-key-for-${path}`);
				},
			};
			implementation = {
				BlobStorage: mockBlobStorage,
			};
		});

		When('I use the implementation', () => {
			// Use implementation
		});

		Then('it should work correctly', () => {
			expect(implementation).toBeDefined();
			expect(implementation.BlobStorage).toBeDefined();
			expect(typeof implementation.BlobStorage.createValetKey).toBe('function');
		});
	});
});
