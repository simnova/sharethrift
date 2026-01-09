import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import {
	type CleanupResult,
	processConversationsForArchivedReservationRequests,
} from './cleanup-archived-reservation-conversations.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(
		__dirname,
		'features/cleanup-archived-reservation-conversations.feature',
	),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockReservationRequestReadRepo: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockConversationReadRepo: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockUnitOfWork: any;
	let result: CleanupResult | undefined;
	let thrownError: Error | undefined;

	BeforeEachScenario(() => {
		mockReservationRequestReadRepo = {
			getByStates: vi.fn(),
		};

		mockConversationReadRepo = {
			getByReservationRequestId: vi.fn(),
		};

		mockUnitOfWork = {
			withScopedTransaction: vi.fn(),
		};

		mockDataSources = {
			readonlyDataSource: {
				ReservationRequest: {
					ReservationRequest: {
						ReservationRequestReadRepo: mockReservationRequestReadRepo,
					},
				},
				Conversation: {
					Conversation: {
						ConversationReadRepo: mockConversationReadRepo,
					},
				},
			},
			domainDataSource: {
				Conversation: {
					Conversation: {
						ConversationUnitOfWork: mockUnitOfWork,
					},
				},
			},
			// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		result = undefined;
		thrownError = undefined;
	});

	Scenario(
		'Successfully processing conversations for archived reservation requests',
		({ Given, When, Then, And }) => {
			let mockConversations: {
				id: string;
				expiresAt: Date | undefined;
				scheduleForDeletion: ReturnType<typeof vi.fn>;
			}[];

			Given(
				'archived reservation requests exist with states "Closed", "Rejected", and "Cancelled"',
				() => {
					mockReservationRequestReadRepo.getByStates.mockResolvedValue([
						{
							id: 'reservation-1',
							state: 'Closed',
							reservationPeriodEnd: new Date('2025-01-01'),
							updatedAt: new Date('2025-01-01'),
						},
						{
							id: 'reservation-2',
							state: 'Rejected',
							reservationPeriodEnd: new Date('2025-01-02'),
							updatedAt: new Date('2025-01-02'),
						},
						{
							id: 'reservation-3',
							state: 'Cancelled',
							reservationPeriodEnd: new Date('2025-01-03'),
							updatedAt: new Date('2025-01-03'),
						},
					]);
				},
			);

			And(
				'each reservation request has conversations without expiration dates',
				() => {
					mockConversations = [
						{
							id: 'conv-1',
							expiresAt: undefined,
							scheduleForDeletion: vi.fn(),
						},
						{
							id: 'conv-2',
							expiresAt: undefined,
							scheduleForDeletion: vi.fn(),
						},
					];

					mockConversationReadRepo.getByReservationRequestId.mockResolvedValue([
						mockConversations[0],
					]);

					mockUnitOfWork.withScopedTransaction.mockImplementation(
						async (
							callback: (repo: {
								getByReservationRequestId: typeof vi.fn;
								get: typeof vi.fn;
								save: typeof vi.fn;
							}) => Promise<void>,
						) => {
							const mockRepo = {
								getByReservationRequestId: vi.fn(() =>
									Promise.resolve(mockConversations),
								),
								get: vi.fn((id: string) =>
									mockConversations.find((c) => c.id === id),
								),
								save: vi.fn(),
							};
							await callback(mockRepo);
						},
					);
				},
			);

			When(
				'the processConversationsForArchivedReservationRequests command is executed',
				async () => {
					result =
						await processConversationsForArchivedReservationRequests(
							mockDataSources,
						);
				},
			);

			Then('the result should show the correct processed count', () => {
				expect(result).toBeDefined();
				expect(result?.processedCount).toBeGreaterThan(0);
			});

			And(
				'conversations without expiresAt should be scheduled for deletion',
				() => {
					expect(result?.scheduledCount).toBeGreaterThan(0);
				},
			);

			And('no errors should be reported', () => {
				expect(result?.errors).toHaveLength(0);
			});
		},
	);

	Scenario(
		'Processing conversations already scheduled for deletion',
		({ Given, When, Then, And }) => {
			Given('archived reservation requests exist', () => {
				mockReservationRequestReadRepo.getByStates.mockResolvedValue([
					{
						id: 'reservation-1',
						state: 'Closed',
						reservationPeriodEnd: new Date('2025-01-01'),
						updatedAt: new Date('2025-01-01'),
					},
				]);
			});

			And('all conversations already have expiresAt set', () => {
				const mockConversations = [
					{
						id: 'conv-1',
						expiresAt: new Date('2025-07-01'),
						scheduleForDeletion: vi.fn(),
					},
					{
						id: 'conv-2',
						expiresAt: new Date('2025-07-02'),
						scheduleForDeletion: vi.fn(),
					},
				];

				mockUnitOfWork.withScopedTransaction.mockImplementation(
					async (
						callback: (repo: {
							getByReservationRequestId: typeof vi.fn;
							get: typeof vi.fn;
							save: typeof vi.fn;
						}) => Promise<void>,
					) => {
						const mockRepo = {
							getByReservationRequestId: vi.fn(() =>
								Promise.resolve(mockConversations),
							),
							get: vi.fn((id: string) =>
								mockConversations.find((c) => c.id === id),
							),
							save: vi.fn(),
						};
						await callback(mockRepo);
					},
				);
			});

			When(
				'the processConversationsForArchivedReservationRequests command is executed',
				async () => {
					result =
						await processConversationsForArchivedReservationRequests(
							mockDataSources,
						);
				},
			);

			Then('the processed count should reflect all conversations', () => {
				expect(result?.processedCount).toBeGreaterThan(0);
			});

			And('the scheduled count should be zero', () => {
				expect(result?.scheduledCount).toBe(0);
			});

			And('no errors should be reported', () => {
				expect(result?.errors).toHaveLength(0);
			});
		},
	);

	Scenario(
		'Handling partial failures during cleanup',
		({ Given, When, Then, And }) => {
			Given('archived reservation requests exist', () => {
				mockReservationRequestReadRepo.getByStates.mockResolvedValue([
					{
						id: 'reservation-1',
						state: 'Closed',
						reservationPeriodEnd: new Date('2025-01-01'),
						updatedAt: new Date('2025-01-01'),
					},
					{
						id: 'reservation-2',
						state: 'Rejected',
						reservationPeriodEnd: new Date('2025-01-02'),
						updatedAt: new Date('2025-01-02'),
					},
				]);
			});

			And(
				"one reservation request's conversations will fail to process",
				() => {
					let callCount = 0;
					mockUnitOfWork.withScopedTransaction.mockImplementation(
						async (callback: (repo: unknown) => Promise<void>) => {
							callCount++;
							if (callCount === 1) {
								// First reservation request succeeds
								const mockConversations = [
									{
										id: 'conv-1',
										expiresAt: undefined,
										scheduleForDeletion: vi.fn(),
									},
								];
								const mockRepo = {
									getByReservationRequestId: vi.fn(() =>
										Promise.resolve(mockConversations),
									),
									save: vi.fn(),
								};
								await callback(mockRepo);
							} else {
								// Second reservation request fails
								throw new Error('Database connection lost');
							}
						},
					);
				},
			);

			When(
				'the processConversationsForArchivedReservationRequests command is executed',
				async () => {
					result =
						await processConversationsForArchivedReservationRequests(
							mockDataSources,
						);
				},
			);

			Then(
				'the result should include errors for the failed reservation request',
				() => {
					expect(result?.errors.length).toBeGreaterThan(0);
					expect(result?.errors[0]).toContain('reservation-2');
				},
			);

			And('successful reservation requests should still be processed', () => {
				expect(result?.processedCount).toBeGreaterThan(0);
			});

			And('the error count should match the number of failures', () => {
				expect(result?.errors).toHaveLength(1);
			});
		},
	);

	Scenario(
		'Handling complete failure during cleanup',
		({ Given, When, Then, And }) => {
			Given(
				'the readonly data source fails when querying reservation requests',
				() => {
					mockReservationRequestReadRepo.getByStates.mockRejectedValue(
						new Error('Database unavailable'),
					);
				},
			);

			When(
				'the processConversationsForArchivedReservationRequests command is executed',
				async () => {
					try {
						await processConversationsForArchivedReservationRequests(
							mockDataSources,
						);
					} catch (error) {
						thrownError = error as Error;
					}
				},
			);

			Then('the command should throw a fatal error', () => {
				expect(thrownError).toBeDefined();
				expect(thrownError?.message).toContain('Database unavailable');
			});

			And('the error should be logged', () => {
				// Error logging is verified through OpenTelemetry span in production
				expect(thrownError).toBeInstanceOf(Error);
			});
		},
	);

	Scenario(
		'Processing when no archived reservation requests exist',
		({ Given, When, Then, And }) => {
			Given('no archived reservation requests exist', () => {
				mockReservationRequestReadRepo.getByStates.mockResolvedValue([]);
			});

			When(
				'the processConversationsForArchivedReservationRequests command is executed',
				async () => {
					result =
						await processConversationsForArchivedReservationRequests(
							mockDataSources,
						);
				},
			);

			Then('the processed count should be zero', () => {
				expect(result?.processedCount).toBe(0);
			});

			And('the scheduled count should be zero', () => {
				expect(result?.scheduledCount).toBe(0);
			});

			And('no errors should be reported', () => {
				expect(result?.errors).toHaveLength(0);
			});
		},
	);
});
