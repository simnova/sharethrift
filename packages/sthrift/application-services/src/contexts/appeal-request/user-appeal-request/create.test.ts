import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { type CreateUserAppealRequestCommand, create } from './create.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/create.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockRepo: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockUnitOfWork: any;
	let command: CreateUserAppealRequestCommand;
	let result:
		| Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestEntityReference
		| undefined;
	let error: Error | undefined;

	BeforeEachScenario(() => {
		mockRepo = {
			getNewInstance: vi.fn(),
			save: vi.fn(),
		};

		mockUnitOfWork = {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
			withScopedTransaction: vi.fn(async (callback: any) => {
				return await callback(mockRepo);
			}),
		};

		mockDataSources = {
			domainDataSource: {
				AppealRequest: {
					UserAppealRequest: {
						UserAppealRequestUnitOfWork: mockUnitOfWork,
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		result = undefined;
		error = undefined;
	});

	Scenario(
		'Successfully creating a user appeal request',
		({ Given, When, Then, And }) => {
			Given('a valid user ID "user-123"', () => {
				command = {
					userId: 'user-123',
					reason: 'Violation of community guidelines',
					blockerId: 'blocker-456',
				};
			});

			And('a valid reason "Violation of community guidelines"', () => {
				// Already set in command
			});

			And('a valid blocker ID "blocker-456"', () => {
				const mockAppealRequest = {
					id: 'appeal-123',
					user: { id: 'user-123' },
					reason: 'Violation of community guidelines',
					blocker: { id: 'blocker-456' },
				};
				mockRepo.getNewInstance.mockResolvedValue(mockAppealRequest);
				mockRepo.save.mockResolvedValue(mockAppealRequest);
			});

			When('the create command is executed', async () => {
				try {
					const createFn = create(mockDataSources);
					result = await createFn(command);
				} catch (err) {
					error = err as Error;
				}
			});

			Then('a new user appeal request should be created', () => {
				expect(mockRepo.getNewInstance).toHaveBeenCalledWith(
					'user-123',
					'Violation of community guidelines',
					'blocker-456',
				);
			});

			And(
				'the created appeal request should have the user ID "user-123"',
				() => {
					expect(result?.user).toBeDefined();
				},
			);

			And('the appeal request should be returned with an ID', () => {
				expect(result).toBeDefined();
				expect(result?.id).toBe('appeal-123');
			});
		},
	);

	Scenario('Handling repository save failure', ({ Given, When, Then }) => {
		Given('valid user appeal request data', () => {
			mockRepo.getNewInstance.mockResolvedValue({ id: 'appeal-123' });
			mockRepo.save.mockResolvedValue(undefined);
		});

		When('the create command is executed and save fails', async () => {
			try {
				const createFn = create(mockDataSources);
				result = await createFn(command);
			} catch (err) {
				error = err as Error;
			}
		});

		Then(
			'an error should be thrown indicating failed to create user appeal request',
			() => {
				expect(error).toBeDefined();
				expect(error?.message).toBe('Failed to create user appeal request');
			},
		);
	});
});
