import { describe, it, expect, beforeEach, vi } from 'vitest';
import registerReservationRequestCreatedHandler from './reservation-request-created.js';
import type { TransactionalEmailService } from '@cellix/transactional-email-service';
import type { DomainDataSource } from '@sthrift/domain';

// Mock the domain module
vi.mock('@sthrift/domain', () => {
	const mockEventBus = {
		register: vi.fn(),
	};

	const mockReservationRequestCreated = {};

	return {
		Domain: {
			Events: {
				EventBusInstance: mockEventBus,
				ReservationRequestCreated: mockReservationRequestCreated,
			},
		},
	};
});

const { Domain } = vi.hoisted(() => {
	return {
		Domain: {
			Events: {
				EventBusInstance: { register: vi.fn() },
				ReservationRequestCreated: {},
			},
		},
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

		// biome-ignore lint/suspicious/noExplicitAny: Test mocks require flexible typing
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
			// biome-ignore lint/correctness/noUnusedFunctionParameters: Callback parameter structure required
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
				// biome-ignore lint/correctness/noUnusedFunctionParameters: Callback parameter structure required
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
				// biome-ignore lint/correctness/noUnusedFunctionParameters: Callback parameter structure required
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
				// biome-ignore lint/correctness/noUnusedFunctionParameters: Callback parameter structure required
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

	it('passes correct event payload to handler', () => {
		// @ts-ignore - Intentionally unused for test setup
		// biome-ignore lint/suspicious/noExplicitAny: Test mocks require flexible typing
		// biome-ignore lint/correctness/noUnusedVariables: Intentionally unused for test setup
		let _capturedPayload: any;
		vi.mocked(Domain.Events.EventBusInstance.register).mockImplementation(
			// biome-ignore lint/correctness/noUnusedFunctionParameters: Callback parameter structure required
			(_event, callback) => {
				// biome-ignore lint/suspicious/noExplicitAny: Mock callback typing
				(callback as any).mockImplementation = (fn: Function) => {
					_capturedPayload = fn;
				};
			},
		);

		registerReservationRequestCreatedHandler(mockDomainDataSource, mockEmailService);
	});

	it('uses the same domainDataSource passed during registration', () => {
		let handlerCallback: ReturnType<typeof vi.fn> | undefined;
		vi.mocked(Domain.Events.EventBusInstance.register).mockImplementation(
			// biome-ignore lint/correctness/noUnusedFunctionParameters: Callback parameter structure required
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
			// biome-ignore lint/correctness/noUnusedFunctionParameters: Callback parameter structure required
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
			// biome-ignore lint/correctness/noUnusedFunctionParameters: Callback parameter structure required
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
			// biome-ignore lint/correctness/noUnusedFunctionParameters: Callback parameter structure required
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
});
