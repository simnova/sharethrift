import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { generatePublicKey } from './generate-public-key.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/generate-public-key.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let error: any;

	BeforeEachScenario(() => {
		mockDataSources = {
			paymentDataSource: {
				PersonalUser: {
					PersonalUser: {
						PaymentPersonalUserRepo: {
							generatePublicKey: vi
								.fn()
								.mockResolvedValue('public-key-abc123'),
						},
					},
				},
			},
			// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;
		result = undefined;
		error = undefined;
	});

	Scenario('Successfully generating a public key', ({ Given, When, Then }) => {
		Given('the payment data source is available', () => {
			// Mock already set up in BeforeEachScenario
		});

		When('the generatePublicKey command is executed', async () => {
			const generateFn = generatePublicKey(mockDataSources);
			result = await generateFn();
		});

		Then('a public key should be returned', () => {
			expect(result).toBeDefined();
			expect(result).toBe('public-key-abc123');
		});
	});

	Scenario(
		'Generating public key when payment data source returns null',
		({ Given, When, Then }) => {
			Given('the payment data source returns null for public key', () => {
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.paymentDataSource as any
				).PersonalUser.PersonalUser.PaymentPersonalUserRepo.generatePublicKey.mockResolvedValue(
					null,
				);
			});

			When('the generatePublicKey command is executed', async () => {
				const generateFn = generatePublicKey(mockDataSources);
				try {
					result = await generateFn();
				} catch (e) {
					error = e;
				}
			});

			Then(
				'an error should be thrown with message "Payment data source is not available"',
				() => {
					expect(error).toBeDefined();
					expect(error.message).toBe('Payment data source is not available');
				},
			);
		},
	);

	Scenario(
		'Generating public key when payment data source is undefined',
		({ Given, When, Then }) => {
			Given('the payment data source is undefined', () => {
				// biome-ignore lint/suspicious/noExplicitAny: Test mock access
				(mockDataSources as any).paymentDataSource = undefined;
			});

			When('the generatePublicKey command is executed', async () => {
				const generateFn = generatePublicKey(mockDataSources);
				try {
					result = await generateFn();
				} catch (e) {
					error = e;
				}
			});

			Then(
				'an error should be thrown with message "Payment data source is not available"',
				() => {
					expect(error).toBeDefined();
					expect(error.message).toBe('Payment data source is not available');
				},
			);
		},
	);
});
