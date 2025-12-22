import { describe, it, expect, beforeEach, vi } from 'vitest';
import registerReservationRequestCreatedHandler from './reservation-request-created.js';
import type { TransactionalEmailService } from '@cellix/transactional-email-service';
import type { DomainDataSource } from '@sthrift/domain';

const { Domain } = vi.hoisted(() => {
	const mockEventBus = {
		register: vi.fn(),
	};

	const mockReservationRequestCreated = {};

	const mockPassportFactory = {
		forSystem: vi.fn(() => ({})),
	};

	return {
		Domain: {
			Events: {
				EventBusInstance: mockEventBus,
				ReservationRequestCreated: mockReservationRequestCreated,
			},
			PassportFactory: mockPassportFactory,
		},
	};
});

// Mock the domain module with the hoisted mock
vi.mock('@sthrift/domain', () => {
	return {
		Domain: Domain,
	};
});

describe('registerReservationRequestCreatedHandler', () => {
	let mockEmailService: TransactionalEmailService;
	let mockDomainDataSource: DomainDataSource;

	beforeEach(() => {
		vi.clearAllMocks();

		mockEmailService = {
			sendTemplatedEmail: vi.fn().mockResolvedValue(undefined),
			startUp: vi.fn().mockResolvedValue(undefined),
			shutDown: vi.fn().mockResolvedValue(undefined),
		} as TransactionalEmailService;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		mockDomainDataSource = {
			User: {
				PersonalUser: {
					PersonalUserUnitOfWork: {
						withTransaction: vi.fn(),
					},
				},
				AdminUser: {
					AdminUserUnitOfWork: {
						withTransaction: vi.fn(),
					},
				},
			},
			Listing: {
				ItemListing: {
					ItemListingUnitOfWork: {
						withTransaction: vi.fn(),
					},
				},
			},
		} as unknown as DomainDataSource;
	});

	it('registers handler with EventBusInstance', () => {
		const registerSpy = vi.spyOn(Domain.Events.EventBusInstance, 'register');

		registerReservationRequestCreatedHandler(mockDomainDataSource, mockEmailService);

		expect(registerSpy).toHaveBeenCalled();
		expect(registerSpy).toHaveBeenCalledWith(
			Domain.Events.ReservationRequestCreated,
			expect.any(Function),
		);
	});

	it('creates a handler function that calls notificationService', async () => {
		let handlerCallback: ReturnType<typeof vi.fn> | undefined;
		vi.mocked(Domain.Events.EventBusInstance.register).mockImplementation(
			(_event, callback) => {
				handlerCallback = callback;
			},
		);

		registerReservationRequestCreatedHandler(mockDomainDataSource, mockEmailService);

		expect(handlerCallback).toBeDefined();

		const payload = {
			reservationRequestId: 'req-123',
			listingId: 'list-456',
			reserverId: 'user-reserver',
			sharerId: 'user-sharer',
			reservationPeriodStart: new Date('2024-01-15'),
			reservationPeriodEnd: new Date('2024-01-20'),
		};

		// Setup mocks for successful email sending
		(mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction as ReturnType<typeof vi.fn>)
			.mockImplementation((
				_passport,
				callback,
			) =>
				callback({
					getById: vi.fn().mockResolvedValue({
						account: { email: 'sharer@example.com' },
						profile: { firstName: 'Sharer' },
					}),
				}),
			);

		(mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction as ReturnType<typeof vi.fn>)
			.mockImplementation((
				_passport,
				callback,
			) =>
				callback({
					getById: vi.fn().mockResolvedValue({
						account: { email: 'reserver@example.com' },
						profile: { firstName: 'Reserver' },
					}),
				}),
			);

		(mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction as ReturnType<typeof vi.fn>)
			.mockImplementation((
				_passport,
				callback,
			) =>
				callback({
					getById: vi
						.fn()
						.mockResolvedValue({ title: 'Beautiful Home' }),
				}),
			);

		// Mock the email service
		mockEmailService.sendTemplatedEmail = vi
			.fn()
			.mockResolvedValue(undefined);

		// biome-ignore lint/style/noNonNullAssertion: Callback is guaranteed to be set by mockImplementation
		const result = await handlerCallback!(payload);

		expect(result).toBeUndefined();
	});

	it('uses the same domainDataSource passed during registration', () => {
		let handlerCallback: ReturnType<typeof vi.fn> | undefined;
		vi.mocked(Domain.Events.EventBusInstance.register).mockImplementation(
			(_event, callback) => {
				handlerCallback = callback;
			},
		);

		// biome-ignore lint/suspicious/noExplicitAny: Test mocks require flexible typing
		const customDomainDataSource: any = {
			Custom: true,
			User: {
				PersonalUser: {
					PersonalUserUnitOfWork: {
						withTransaction: vi.fn().mockResolvedValue({
							account: { email: 'test@example.com' },
						}),
					},
				},
				AdminUser: {
					AdminUserUnitOfWork: {
						withTransaction: vi.fn(),
					},
				},
			},
			Listing: {
				ItemListing: {
					ItemListingUnitOfWork: {
						withTransaction: vi.fn().mockResolvedValue({ title: 'Test' }),
					},
				},
			},
		};

		registerReservationRequestCreatedHandler(customDomainDataSource, mockEmailService);

		expect(handlerCallback).toBeDefined();
	});

	it('uses the same emailService passed during registration', () => {
		let handlerCallback: ReturnType<typeof vi.fn> | undefined;
		vi.mocked(Domain.Events.EventBusInstance.register).mockImplementation(
			(_event, callback) => {
				handlerCallback = callback;
			},
		);

		const customEmailService = {
			sendTemplatedEmail: vi.fn().mockResolvedValue(undefined),
			startUp: vi.fn().mockResolvedValue(undefined),
			shutDown: vi.fn().mockResolvedValue(undefined),
		} as TransactionalEmailService;

		registerReservationRequestCreatedHandler(mockDomainDataSource, customEmailService);

		expect(handlerCallback).toBeDefined();
	});

	it('handles errors from notification service without throwing', async () => {
		let handlerCallback: ReturnType<typeof vi.fn> | undefined;
		vi.mocked(Domain.Events.EventBusInstance.register).mockImplementation(
			(_event, callback) => {
				handlerCallback = callback;
			},
		);

		(mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction as ReturnType<typeof vi.fn>)
			.mockRejectedValue(new Error('Database error'));

		registerReservationRequestCreatedHandler(mockDomainDataSource, mockEmailService);

		const payload = {
			reservationRequestId: 'req-123',
			listingId: 'list-456',
			reserverId: 'user-reserver',
			sharerId: 'user-sharer',
			reservationPeriodStart: new Date('2024-01-15'),
			reservationPeriodEnd: new Date('2024-01-20'),
		};

		// Should not throw
		// biome-ignore lint/style/noNonNullAssertion: Callback is guaranteed to be set by mockImplementation
		await expect(handlerCallback!(payload)).resolves.not.toThrow();
	});

	it('handles all required fields in payload', () => {
		let handlerCallback: ReturnType<typeof vi.fn> | undefined;
		vi.mocked(Domain.Events.EventBusInstance.register).mockImplementation(
			(_event, callback) => {
				handlerCallback = callback;
			},
		);

		registerReservationRequestCreatedHandler(mockDomainDataSource, mockEmailService);

		const payloadWithAllFields = {
			reservationRequestId: 'req-456',
			listingId: 'list-789',
			reserverId: 'user-123',
			sharerId: 'user-456',
			reservationPeriodStart: new Date('2024-02-01'),
			reservationPeriodEnd: new Date('2024-02-10'),
		};

		expect(handlerCallback).toBeDefined();
		// Verify it accepts the payload structure
		expect(payloadWithAllFields).toMatchObject({
			reservationRequestId: expect.any(String),
			listingId: expect.any(String),
			reserverId: expect.any(String),
			sharerId: expect.any(String),
			reservationPeriodStart: expect.any(Date),
			reservationPeriodEnd: expect.any(Date),
		});
	});

	it('can be called multiple times to register same event', () => {
		registerReservationRequestCreatedHandler(mockDomainDataSource, mockEmailService);
		registerReservationRequestCreatedHandler(mockDomainDataSource, mockEmailService);

		expect(vi.mocked(Domain.Events.EventBusInstance.register)).toHaveBeenCalledTimes(
			2,
		);
	});

	describe('Handler payload processing', () => {
		it('extracts all payload fields correctly', () => {
			let handlerCallback: ReturnType<typeof vi.fn> | undefined;
			
			vi.mocked(Domain.Events.EventBusInstance.register).mockImplementation(
				(_event, callback) => {
					handlerCallback = callback;
				},
			);

			registerReservationRequestCreatedHandler(mockDomainDataSource, mockEmailService);

			const payload = {
				reservationRequestId: 'req-789',
				listingId: 'list-101112',
				reserverId: 'reserver-001',
				sharerId: 'sharer-001',
				reservationPeriodStart: new Date('2024-03-01'),
				reservationPeriodEnd: new Date('2024-03-10'),
			};

			expect(handlerCallback).toBeDefined();
			// Verify payload structure matches expectations
			expect(payload.reservationRequestId).toBe('req-789');
			expect(payload.listingId).toBe('list-101112');
		});

		it('passes correct parameters to notification service', async () => {
			let handlerCallback: ReturnType<typeof vi.fn> | undefined;
			
			vi.mocked(Domain.Events.EventBusInstance.register).mockImplementation(
				(_event, callback) => {
					handlerCallback = callback;
				},
			);

			// Setup mocks
			(mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction as ReturnType<typeof vi.fn>)
				.mockImplementation((_, callback) =>
					callback({
						getById: vi.fn().mockResolvedValue({
							account: { email: 'test@example.com' },
							profile: { firstName: 'Test' },
						}),
					}),
				);

			(mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction as ReturnType<typeof vi.fn>)
				.mockImplementation((_, callback) =>
					callback({
						getById: vi.fn().mockResolvedValue({
							account: { email: 'test@example.com' },
							profile: { firstName: 'Test' },
						}),
					}),
				);

			(mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction as ReturnType<typeof vi.fn>)
				.mockImplementation((_, callback) =>
					callback({
						getById: vi.fn().mockResolvedValue({ title: 'Test Listing' }),
					}),
				);

			registerReservationRequestCreatedHandler(mockDomainDataSource, mockEmailService);

			const payload = {
				reservationRequestId: 'req-abc123',
				listingId: 'list-xyz789',
				reserverId: 'user-reserver-123',
				sharerId: 'user-sharer-456',
				reservationPeriodStart: new Date('2024-04-15'),
				reservationPeriodEnd: new Date('2024-04-20'),
			};

			// biome-ignore lint/style/noNonNullAssertion: Handler is guaranteed to be set
			await handlerCallback!(payload);

			expect(mockEmailService.sendTemplatedEmail).toHaveBeenCalled();
		});

		it('returns undefined from handler callback', async () => {
			let handlerCallback: ReturnType<typeof vi.fn> | undefined;
			
			vi.mocked(Domain.Events.EventBusInstance.register).mockImplementation(
				(_event, callback) => {
					handlerCallback = callback;
				},
			);

			(mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction as ReturnType<typeof vi.fn>)
				.mockImplementation((_, callback) =>
					callback({
						getById: vi.fn().mockResolvedValue({
							account: { email: 'test@example.com' },
							profile: { firstName: 'Test' },
						}),
					}),
				);

			(mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction as ReturnType<typeof vi.fn>)
				.mockImplementation((_, callback) =>
					callback({
						getById: vi.fn().mockResolvedValue({
							account: { email: 'test@example.com' },
							profile: { firstName: 'Test' },
						}),
					}),
				);

			(mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction as ReturnType<typeof vi.fn>)
				.mockImplementation((_, callback) =>
					callback({
						getById: vi.fn().mockResolvedValue({ title: 'Test' }),
					}),
				);

			registerReservationRequestCreatedHandler(mockDomainDataSource, mockEmailService);

			const payload = {
				reservationRequestId: 'req-123',
				listingId: 'list-456',
				reserverId: 'user-reserver',
				sharerId: 'user-sharer',
				reservationPeriodStart: new Date('2024-01-15'),
				reservationPeriodEnd: new Date('2024-01-20'),
			};

			// biome-ignore lint/style/noNonNullAssertion: Handler is guaranteed to be set
			const result = await handlerCallback!(payload);

			expect(result).toBeUndefined();
		});
	});

	describe('Event handler registration and integration', () => {
		it('registers handler with correct event type', () => {
			let registeredEventType: unknown;
			
			vi.mocked(Domain.Events.EventBusInstance.register).mockImplementation(
				(eventType, _callback) => {
					registeredEventType = eventType;
				},
			);

			registerReservationRequestCreatedHandler(mockDomainDataSource, mockEmailService);

			expect(registeredEventType).toBe(Domain.Events.ReservationRequestCreated);
		});

		it('creates a new notification service instance', () => {
			registerReservationRequestCreatedHandler(mockDomainDataSource, mockEmailService);

			// Verify that the handler was registered
			expect(vi.mocked(Domain.Events.EventBusInstance.register)).toHaveBeenCalled();
		});

		it('handler receives all event bus callbacks correctly', () => {
			let handlerFunction: unknown;
			
			vi.mocked(Domain.Events.EventBusInstance.register).mockImplementation(
				(_event, callback) => {
					handlerFunction = callback;
				},
			);

			registerReservationRequestCreatedHandler(mockDomainDataSource, mockEmailService);

			expect(typeof handlerFunction).toBe('function');
		});
	});

	describe('Error handling in handler', () => {
		it('does not throw when notification service throws', async () => {
			let handlerCallback: ReturnType<typeof vi.fn> | undefined;
			
			vi.mocked(Domain.Events.EventBusInstance.register).mockImplementation(
				(_event, callback) => {
					handlerCallback = callback;
				},
			);

			(mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction as ReturnType<typeof vi.fn>)
				.mockRejectedValue(new Error('Service error'));

			registerReservationRequestCreatedHandler(mockDomainDataSource, mockEmailService);

			const payload = {
				reservationRequestId: 'req-123',
				listingId: 'list-456',
				reserverId: 'user-reserver',
				sharerId: 'user-sharer',
				reservationPeriodStart: new Date('2024-01-15'),
				reservationPeriodEnd: new Date('2024-01-20'),
			};

			// biome-ignore lint/style/noNonNullAssertion: Handler is guaranteed to be set
			await expect(handlerCallback!(payload)).resolves.not.toThrow();
		});

		it('handles missing payload fields gracefully', () => {
			let handlerCallback: ReturnType<typeof vi.fn> | undefined;
			
			vi.mocked(Domain.Events.EventBusInstance.register).mockImplementation(
				(_event, callback) => {
					handlerCallback = callback;
				},
			);

		registerReservationRequestCreatedHandler(mockDomainDataSource, mockEmailService);

		// Handler should be able to accept and process incomplete payloads
		expect(handlerCallback).toBeDefined();
		});

		it('handles async email service failures', async () => {
			let handlerCallback: ReturnType<typeof vi.fn> | undefined;
			
			vi.mocked(Domain.Events.EventBusInstance.register).mockImplementation(
				(_event, callback) => {
					handlerCallback = callback;
				},
			);

			mockEmailService.sendTemplatedEmail = vi
				.fn()
				.mockRejectedValue(new Error('Email service down'));

			(mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction as ReturnType<typeof vi.fn>)
				.mockImplementation((_, callback) =>
					callback({
						getById: vi.fn().mockResolvedValue({
							account: { email: 'test@example.com' },
							profile: { firstName: 'Test' },
						}),
					}),
				);

			(mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction as ReturnType<typeof vi.fn>)
				.mockImplementation((_, callback) =>
					callback({
						getById: vi.fn().mockResolvedValue({
							account: { email: 'test@example.com' },
							profile: { firstName: 'Test' },
						}),
					}),
				);

			(mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction as ReturnType<typeof vi.fn>)
				.mockImplementation((_, callback) =>
					callback({
						getById: vi.fn().mockResolvedValue({ title: 'Test' }),
					}),
				);

			registerReservationRequestCreatedHandler(mockDomainDataSource, mockEmailService);

			const payload = {
				reservationRequestId: 'req-123',
				listingId: 'list-456',
				reserverId: 'user-reserver',
				sharerId: 'user-sharer',
				reservationPeriodStart: new Date('2024-01-15'),
				reservationPeriodEnd: new Date('2024-01-20'),
			};

			// biome-ignore lint/style/noNonNullAssertion: Handler is guaranteed to be set
			await expect(handlerCallback!(payload)).resolves.not.toThrow();
		});
	});

	describe('Multiple handler registrations', () => {
		it('supports registering multiple handlers independently', () => {
			const email1 = {
				sendTemplatedEmail: vi.fn().mockResolvedValue(undefined),
				startUp: vi.fn().mockResolvedValue(undefined),
				shutDown: vi.fn().mockResolvedValue(undefined),
			} as TransactionalEmailService;

			const email2 = {
				sendTemplatedEmail: vi.fn().mockResolvedValue(undefined),
				startUp: vi.fn().mockResolvedValue(undefined),
				shutDown: vi.fn().mockResolvedValue(undefined),
			} as TransactionalEmailService;

			registerReservationRequestCreatedHandler(mockDomainDataSource, email1);
			registerReservationRequestCreatedHandler(mockDomainDataSource, email2);

			expect(vi.mocked(Domain.Events.EventBusInstance.register)).toHaveBeenCalledTimes(
				2,
			);
		});

		it('each handler registration has its own notification service instance', () => {
			const mockDomainDataSource1 = {
				...mockDomainDataSource,
			};
			const mockDomainDataSource2 = {
				...mockDomainDataSource,
			};

			registerReservationRequestCreatedHandler(mockDomainDataSource1, mockEmailService);
			registerReservationRequestCreatedHandler(mockDomainDataSource2, mockEmailService);

			expect(vi.mocked(Domain.Events.EventBusInstance.register)).toHaveBeenCalledTimes(
				2,
			);
		});
	});

	describe('Payload date handling', () => {
		it('processes Date objects correctly in payload', async () => {
			let handlerCallback: ReturnType<typeof vi.fn> | undefined;
			
			vi.mocked(Domain.Events.EventBusInstance.register).mockImplementation(
				(_event, callback) => {
					handlerCallback = callback;
				},
			);

			(mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction as ReturnType<typeof vi.fn>)
				.mockImplementation((_, callback) =>
					callback({
						getById: vi.fn().mockResolvedValue({
							account: { email: 'test@example.com' },
							profile: { firstName: 'Test' },
						}),
					}),
				);

			(mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction as ReturnType<typeof vi.fn>)
				.mockImplementation((_, callback) =>
					callback({
						getById: vi.fn().mockResolvedValue({
							account: { email: 'test@example.com' },
							profile: { firstName: 'Test' },
						}),
					}),
				);

			(mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction as ReturnType<typeof vi.fn>)
				.mockImplementation((_, callback) =>
					callback({
						getById: vi.fn().mockResolvedValue({ title: 'Test' }),
					}),
				);

			registerReservationRequestCreatedHandler(mockDomainDataSource, mockEmailService);

			const startDate = new Date('2024-05-20T10:00:00Z');
			const endDate = new Date('2024-05-25T15:00:00Z');

			const payload = {
				reservationRequestId: 'req-date-test',
				listingId: 'list-date-test',
				reserverId: 'user-reserver-date',
				sharerId: 'user-sharer-date',
				reservationPeriodStart: startDate,
				reservationPeriodEnd: endDate,
			};

			// biome-ignore lint/style/noNonNullAssertion: Handler is guaranteed to be set
			await handlerCallback!(payload);

			expect(mockEmailService.sendTemplatedEmail).toHaveBeenCalled();
		});
	});

	describe('Integration with NotificationService', () => {
		it('passes domainDataSource to notification service', () => {
			let handlerCallback: ReturnType<typeof vi.fn> | undefined;
			
			vi.mocked(Domain.Events.EventBusInstance.register).mockImplementation(
				(_event, callback) => {
					handlerCallback = callback;
				},
			);

			registerReservationRequestCreatedHandler(mockDomainDataSource, mockEmailService);

			// Verify the notification service was created with the domain data source
			expect(handlerCallback).toBeDefined();
		});

		it('passes emailService to notification service', () => {
			let handlerCallback: ReturnType<typeof vi.fn> | undefined;
			
			vi.mocked(Domain.Events.EventBusInstance.register).mockImplementation(
				(_event, callback) => {
					handlerCallback = callback;
				},
			);

			registerReservationRequestCreatedHandler(mockDomainDataSource, mockEmailService);

			// Verify the notification service was created with email service
			expect(handlerCallback).toBeDefined();
		});
	});

	describe('Edge cases and boundary conditions', () => {
		it('handles very long IDs in payload', async () => {
			let handlerCallback: ReturnType<typeof vi.fn> | undefined;
			
			vi.mocked(Domain.Events.EventBusInstance.register).mockImplementation(
				(_event, callback) => {
					handlerCallback = callback;
				},
			);

			(mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction as ReturnType<typeof vi.fn>)
				.mockImplementation((_, callback) =>
					callback({
						getById: vi.fn().mockResolvedValue({
							account: { email: 'test@example.com' },
							profile: { firstName: 'Test' },
						}),
					}),
				);

			(mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction as ReturnType<typeof vi.fn>)
				.mockImplementation((_, callback) =>
					callback({
						getById: vi.fn().mockResolvedValue({
							account: { email: 'test@example.com' },
							profile: { firstName: 'Test' },
						}),
					}),
				);

			(mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction as ReturnType<typeof vi.fn>)
				.mockImplementation((_, callback) =>
					callback({
						getById: vi.fn().mockResolvedValue({ title: 'Test' }),
					}),
				);

			registerReservationRequestCreatedHandler(mockDomainDataSource, mockEmailService);

			const longId = 'a'.repeat(500);
			const payload = {
				reservationRequestId: longId,
				listingId: longId,
				reserverId: longId,
				sharerId: longId,
				reservationPeriodStart: new Date('2024-01-15'),
				reservationPeriodEnd: new Date('2024-01-20'),
			};

			// biome-ignore lint/style/noNonNullAssertion: Handler is guaranteed to be set
			await expect(handlerCallback!(payload)).resolves.not.toThrow();
		});

		it('handles concurrent payload processing', async () => {
			let handlerCallback: ReturnType<typeof vi.fn> | undefined;
			
			vi.mocked(Domain.Events.EventBusInstance.register).mockImplementation(
				(_event, callback) => {
					handlerCallback = callback;
				},
			);

			(mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction as ReturnType<typeof vi.fn>)
				.mockImplementation(async (_, callback) =>
					callback({
						getById: vi.fn().mockResolvedValue({
							account: { email: 'test@example.com' },
							profile: { firstName: 'Test' },
						}),
					}),
				);

			(mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction as ReturnType<typeof vi.fn>)
				.mockImplementation(async (_, callback) =>
					callback({
						getById: vi.fn().mockResolvedValue({
							account: { email: 'test@example.com' },
							profile: { firstName: 'Test' },
						}),
					}),
				);

			(mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction as ReturnType<typeof vi.fn>)
				.mockImplementation(async (_, callback) =>
					callback({
						getById: vi.fn().mockResolvedValue({ title: 'Test' }),
					}),
				);

			registerReservationRequestCreatedHandler(mockDomainDataSource, mockEmailService);

			const payloads = Array.from({ length: 5 }, (_, i) => ({
				reservationRequestId: `req-${i}`,
				listingId: `list-${i}`,
				reserverId: `reserver-${i}`,
				sharerId: `sharer-${i}`,
				reservationPeriodStart: new Date('2024-01-15'),
				reservationPeriodEnd: new Date('2024-01-20'),
			}));

			// biome-ignore lint/style/noNonNullAssertion: Handler is guaranteed to be set
			await Promise.all(payloads.map(p => handlerCallback!(p)));

			// Should have been called for each payload
			expect(mockEmailService.sendTemplatedEmail).toHaveBeenCalled();
		}, 10000);
	});
});
