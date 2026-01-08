import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi, type MockedFunction } from 'vitest';
import type { Timer, InvocationContext } from '@azure/functions';
import type { ApplicationServicesFactory } from '@sthrift/application-services';
import { conversationCleanupHandlerCreator } from './conversation-cleanup-handler.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/conversation-cleanup-handler.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockApplicationServicesFactory: ApplicationServicesFactory;
	let mockTimer: Timer;
	let mockContext: InvocationContext;
	let mockLog: MockedFunction<(...args: unknown[]) => void>;

	BeforeEachScenario(() => {
		mockLog = vi.fn();
		mockContext = {
			log: mockLog,
		} as unknown as InvocationContext;

		mockTimer = {
			isPastDue: false,
		} as Timer;

		const mockAppServices = {
			Conversation: {
				Conversation: {
					processConversationsForArchivedListings: vi.fn().mockResolvedValue({
						processedCount: 10,
						scheduledCount: 5,
						timestamp: new Date(),
						errors: [],
					}),
					processConversationsForArchivedReservationRequests: vi
						.fn()
						.mockResolvedValue({
							processedCount: 8,
							scheduledCount: 3,
							timestamp: new Date(),
							errors: [],
						}),
				},
			},
		};

		mockApplicationServicesFactory = {
			forRequest: vi.fn().mockResolvedValue(mockAppServices),
		} as unknown as ApplicationServicesFactory;
	});

	Scenario(
		'Executing both cleanup phases successfully',
		({ Given, When, Then, And }) => {
			Given('a conversation cleanup handler', () => {
				// Setup is done in BeforeEachScenario
			});

			When('the timer trigger fires', async () => {
				const handler = conversationCleanupHandlerCreator(
					mockApplicationServicesFactory,
				);
				await handler(mockTimer, mockContext);
			});

			Then('both cleanup phases should execute successfully', () => {
				expect(mockLog).toHaveBeenCalledWith(
					expect.stringContaining('[ConversationCleanup] Timer trigger fired'),
				);
			});

			And('the handler should log listings cleanup completion', () => {
				expect(mockLog).toHaveBeenCalledWith(
					expect.stringContaining('Listings cleanup complete. Processed: 10'),
				);
			});

			And(
				'the handler should log reservation requests cleanup completion',
				() => {
					expect(mockLog).toHaveBeenCalledWith(
						expect.stringContaining(
							'Reservation requests cleanup complete. Processed: 8',
						),
					);
				},
			);

			And('the handler should log overall totals', () => {
				expect(mockLog).toHaveBeenCalledWith(
					expect.stringContaining(
						'Overall totals - Processed: 18, Scheduled: 8',
					),
				);
			});
		},
	);

	Scenario('Timer is past due', ({ Given, When, Then, And }) => {
		Given('a conversation cleanup handler', () => {
			mockTimer.isPastDue = true;
		});

		When('the timer trigger fires and is past due', async () => {
			const handler = conversationCleanupHandlerCreator(
				mockApplicationServicesFactory,
			);
			await handler(mockTimer, mockContext);
		});

		Then('the handler should log that the timer is past due', () => {
			expect(mockLog).toHaveBeenCalledWith(
				expect.stringContaining('Timer is past due'),
			);
		});

		And('both cleanup phases should still execute', () => {
			expect(mockLog).toHaveBeenCalledWith(
				expect.stringContaining('Listings cleanup complete'),
			);
			expect(mockLog).toHaveBeenCalledWith(
				expect.stringContaining('Reservation requests cleanup complete'),
			);
		});
	});

	Scenario(
		'Logging errors from listings cleanup without preventing reservation cleanup',
		({ Given, When, Then, And }) => {
			Given('a conversation cleanup handler', () => {
				// Setup is done in BeforeEachScenario
			});

			When('the listings cleanup phase has errors', async () => {
				const mockAppServices = {
					Conversation: {
						Conversation: {
							processConversationsForArchivedListings: vi
								.fn()
								.mockResolvedValue({
									processedCount: 10,
									scheduledCount: 5,
									timestamp: new Date(),
									errors: ['Error 1', 'Error 2'],
								}),
							processConversationsForArchivedReservationRequests: vi
								.fn()
								.mockResolvedValue({
									processedCount: 8,
									scheduledCount: 3,
									timestamp: new Date(),
									errors: [],
								}),
						},
					},
				};

				mockApplicationServicesFactory.forRequest = vi
					.fn()
					.mockResolvedValue(mockAppServices);

				const handler = conversationCleanupHandlerCreator(
					mockApplicationServicesFactory,
				);
				await handler(mockTimer, mockContext);
			});

			Then('the handler should log the listings errors', () => {
				expect(mockLog).toHaveBeenCalledWith(
					expect.stringContaining('Listings errors: Error 1; Error 2'),
				);
			});

			And('the reservation requests cleanup should still execute', () => {
				expect(mockLog).toHaveBeenCalledWith(
					expect.stringContaining('Reservation requests cleanup complete'),
				);
			});
		},
	);

	Scenario(
		'Continuing with reservation cleanup even if listings cleanup throws',
		({ Given, When, Then, And }) => {
			let error: Error | undefined;

			Given('a conversation cleanup handler', () => {
				// Setup is done in BeforeEachScenario
			});

			When('the listings cleanup phase throws a fatal error', async () => {
				const mockAppServices = {
					Conversation: {
						Conversation: {
							processConversationsForArchivedListings: vi
								.fn()
								.mockRejectedValue(new Error('Listings DB connection failed')),
							processConversationsForArchivedReservationRequests: vi
								.fn()
								.mockResolvedValue({
									processedCount: 8,
									scheduledCount: 3,
									timestamp: new Date(),
									errors: [],
								}),
						},
					},
				};

				mockApplicationServicesFactory.forRequest = vi
					.fn()
					.mockResolvedValue(mockAppServices);

				const handler = conversationCleanupHandlerCreator(
					mockApplicationServicesFactory,
				);

				try {
					await handler(mockTimer, mockContext);
				} catch (err) {
					error = err as Error;
				}
			});

			Then('the handler should log the fatal listings error', () => {
				expect(mockLog).toHaveBeenCalledWith(
					expect.stringContaining('Fatal error in listings cleanup'),
				);
			});

			And('the reservation requests cleanup should still execute', () => {
				expect(mockLog).toHaveBeenCalledWith(
					expect.stringContaining('Reservation requests cleanup complete'),
				);
			});

			And('the handler should throw the listings error', () => {
				expect(error).toBeDefined();
				expect(error?.message).toBe('Listings DB connection failed');
			});
		},
	);

	Scenario(
		'Throwing if both cleanup phases fail',
		({ Given, When, Then, And }) => {
			let error: Error | undefined;

			Given('a conversation cleanup handler', () => {
				// Setup is done in BeforeEachScenario
			});

			When('both cleanup phases throw fatal errors', async () => {
				const mockAppServices = {
					Conversation: {
						Conversation: {
							processConversationsForArchivedListings: vi
								.fn()
								.mockRejectedValue(new Error('Listings error')),
							processConversationsForArchivedReservationRequests: vi
								.fn()
								.mockRejectedValue(new Error('Reservations error')),
						},
					},
				};

				mockApplicationServicesFactory.forRequest = vi
					.fn()
					.mockResolvedValue(mockAppServices);

				const handler = conversationCleanupHandlerCreator(
					mockApplicationServicesFactory,
				);

				try {
					await handler(mockTimer, mockContext);
				} catch (err) {
					error = err as Error;
				}
			});

			Then('the handler should log that both phases failed', () => {
				expect(mockLog).toHaveBeenCalledWith(
					expect.stringContaining('Both cleanup phases failed'),
				);
			});

			And('the handler should throw a combined error', () => {
				expect(error).toBeDefined();
				expect(error?.message).toContain('Both cleanup phases failed');
			});
		},
	);

	Scenario(
		'Throwing only reservation error if only reservation phase fails',
		({ Given, When, Then, And }) => {
			let error: Error | undefined;

			Given('a conversation cleanup handler', () => {
				// Setup is done in BeforeEachScenario
			});

			When(
				'only the reservation cleanup phase throws a fatal error',
				async () => {
					const mockAppServices = {
						Conversation: {
							Conversation: {
								processConversationsForArchivedListings: vi
									.fn()
									.mockResolvedValue({
										processedCount: 10,
										scheduledCount: 5,
										timestamp: new Date(),
										errors: [],
									}),
								processConversationsForArchivedReservationRequests: vi
									.fn()
									.mockRejectedValue(new Error('Reservations DB error')),
							},
						},
					};

					mockApplicationServicesFactory.forRequest = vi
						.fn()
						.mockResolvedValue(mockAppServices);

					const handler = conversationCleanupHandlerCreator(
						mockApplicationServicesFactory,
					);

					try {
						await handler(mockTimer, mockContext);
					} catch (err) {
						error = err as Error;
					}
				},
			);

			Then('the listings cleanup should complete successfully', () => {
				expect(mockLog).toHaveBeenCalledWith(
					expect.stringContaining('Listings cleanup complete'),
				);
			});

			And('the handler should log the fatal reservation error', () => {
				expect(mockLog).toHaveBeenCalledWith(
					expect.stringContaining(
						'Fatal error in reservation requests cleanup',
					),
				);
			});

			And('the handler should throw the reservation error', () => {
				expect(error).toBeDefined();
				expect(error?.message).toBe('Reservations DB error');
			});
		},
	);
});
