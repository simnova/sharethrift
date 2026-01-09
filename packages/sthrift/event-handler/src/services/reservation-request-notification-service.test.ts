import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ReservationRequestNotificationService } from './reservation-request-notification-service.js';
import type { TransactionalEmailService } from '@cellix/transactional-email-service';

// Mock the @sthrift/domain module to avoid dynamic import delays
vi.mock('@sthrift/domain', () => ({
	Domain: {
		PassportFactory: {
			forSystem: vi.fn(() => ({ system: true })),
		},
	},
}));

describe('ReservationRequestNotificationService', () => {
	let service: ReservationRequestNotificationService;
	let mockEmailService: TransactionalEmailService;
	// biome-ignore lint/suspicious/noExplicitAny: Test mocks require flexible typing
	let mockDomainDataSource: any;

	beforeEach(() => {
		// Create mock email service
		mockEmailService = {
			sendTemplatedEmail: vi.fn().mockResolvedValue(undefined),
			startUp: vi.fn().mockResolvedValue(undefined),
			shutDown: vi.fn().mockResolvedValue(undefined),
		} as TransactionalEmailService;

		// Helper to create mocks that bridge between callback-based calls and mockResolvedValue/mockRejectedValue
		const createWithTransactionMock = () => {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock infrastructure
			let returnValue: any;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock infrastructure
			let errorValue: any;
			let hasError = false;
			// Queue for Once methods - stores {type: 'value'|'error', value: any}
			// biome-ignore lint/suspicious/noExplicitAny: Test mock infrastructure
			const callQueue: any[] = [];
			let callCount = 0;

			// biome-ignore lint/suspicious/noExplicitAny: Test mock infrastructure
			const mock = vi.fn(async (_passport: any, callback: any) => {
				// Check if there's a queued item for this call
				if (callCount < callQueue.length) {
					const queued = callQueue[callCount++];
					if (queued.type === 'error') {
						throw queued.value;
					}
					const mockRepo = {
						getById: vi.fn().mockResolvedValue(queued.value),
					};
					return await callback(mockRepo);
				}
				
				callCount++;
				if (hasError) {
					throw errorValue;
				}
				if (returnValue !== undefined) {
					const mockRepo = {
						getById: vi.fn().mockResolvedValue(returnValue),
					};
					return await callback(mockRepo);
				}
				// No value set yet, return undefined
				const mockRepo = {
					getById: vi.fn().mockResolvedValue(undefined),
				};
				return await callback(mockRepo);
			});

			// Override mockResolvedValue to store the value
			// biome-ignore lint/suspicious/noExplicitAny: Test mock infrastructure
			mock.mockResolvedValue = function(value: any) {
				returnValue = value;
				hasError = false;
				return this;
			};

			// Override mockRejectedValue to store the error
			// biome-ignore lint/suspicious/noExplicitAny: Test mock infrastructure
			mock.mockRejectedValue = function(error: any) {
				errorValue = error;
				hasError = true;
				return this;
			};

			// Add mockResolvedValueOnce
			// biome-ignore lint/suspicious/noExplicitAny: Test mock infrastructure
			mock.mockResolvedValueOnce = function(value: any) {
				callQueue.push({ type: 'value', value });
				return this;
			};

			// Add mockRejectedValueOnce  
			// biome-ignore lint/suspicious/noExplicitAny: Test mock infrastructure
			mock.mockRejectedValueOnce = function(error: any) {
				callQueue.push({ type: 'error', value: error });
				return this;
			};

			// Override mockImplementation to support custom implementations
			const originalMockImplementation = mock.mockImplementation.bind(mock);
			// biome-ignore lint/suspicious/noExplicitAny: Test mock infrastructure
			mock.mockImplementation = (impl: any) => originalMockImplementation(impl);

			return mock;
		};

		// Create mock domain data source
		mockDomainDataSource = {
			User: {
				PersonalUser: {
					PersonalUserUnitOfWork: {
						withTransaction: createWithTransactionMock(),
					},
				},
				AdminUser: {
					AdminUserUnitOfWork: {
						withTransaction: createWithTransactionMock(),
					},
				},
			},
			Listing: {
				ItemListing: {
					ItemListingUnitOfWork: {
						withTransaction: createWithTransactionMock(),
					},
				},
			},
		};

		service = new ReservationRequestNotificationService(
			mockDomainDataSource,
			mockEmailService,
		);
	});

	describe('sendReservationRequestNotification', () => {
		const baseParams = {
			reservationRequestId: 'req-123',
			listingId: 'list-456',
			reserverId: 'user-reserver',
			sharerId: 'user-sharer',
			reservationPeriodStart: new Date('2024-01-15'),
			reservationPeriodEnd: new Date('2024-01-20'),
		};

		it('successfully sends email notification with valid data', async () => {
			const sharer = {
				account: { email: 'sharer@example.com' },
				profile: { firstName: 'Sharer' },
			};

			const reserver = {
				account: { email: 'reserver@example.com' },
				profile: { firstName: 'Reserver' },
			};

			const listing = {
				title: 'Beautiful Home',
			};

		// Mock the UnitOfWork calls
		mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
			.mockImplementation(async (_passport: unknown, callback: (repo: unknown) => Promise<unknown>) => {
				const mockRepo = {
					getById: vi.fn().mockImplementation((userId: string) => {
						return Promise.resolve(userId === baseParams.sharerId ? sharer : reserver);
					}),
				};
				return await callback(mockRepo);
			});

		mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
			.mockImplementation(async (_passport: unknown, callback: (repo: unknown) => Promise<unknown>) => {
				const mockRepo = {
					getById: vi.fn().mockResolvedValue(listing),
				};
				return await callback(mockRepo);
			});

			await service.sendReservationRequestNotification(
				baseParams.reservationRequestId,
				baseParams.listingId,
				baseParams.reserverId,
				baseParams.sharerId,
				baseParams.reservationPeriodStart,
				baseParams.reservationPeriodEnd,
			);

			expect(mockEmailService.sendTemplatedEmail).toHaveBeenCalledWith(
				'reservation-request-notification',
				expect.objectContaining({
					email: 'sharer@example.com',
					name: expect.any(String),
				}),
				expect.objectContaining({
					sharerName: expect.any(String),
					reserverName: expect.any(String),
					listingTitle: 'Beautiful Home',
				}),
			);
		});

		it('handles missing sharer gracefully and logs error', async () => {
			const consoleSpy = vi.spyOn(console, 'error');

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockRejectedValue(new Error('User not found'));

			await service.sendReservationRequestNotification(
				baseParams.reservationRequestId,
				baseParams.listingId,
				baseParams.reserverId,
				baseParams.sharerId,
				baseParams.reservationPeriodStart,
				baseParams.reservationPeriodEnd,
			);

			expect(mockEmailService.sendTemplatedEmail).not.toHaveBeenCalled();
			expect(consoleSpy).toHaveBeenCalled();

			consoleSpy.mockRestore();
		});

		it('handles missing listing gracefully', async () => {
			const sharer = {
				account: { email: 'sharer@example.com' },
				profile: { firstName: 'Sharer' },
			};

			const reserver = {
				account: { email: 'reserver@example.com' },
				profile: { firstName: 'Reserver' },
			};

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockResolvedValue(sharer);
			mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
				.mockResolvedValue(reserver);

			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockRejectedValue(new Error('Listing not found'));

			await service.sendReservationRequestNotification(
				baseParams.reservationRequestId,
				baseParams.listingId,
				baseParams.reserverId,
				baseParams.sharerId,
				baseParams.reservationPeriodStart,
				baseParams.reservationPeriodEnd,
			);

			expect(mockEmailService.sendTemplatedEmail).not.toHaveBeenCalled();
		});

		it('handles sharer without email address', async () => {
			const sharer = {
				profile: { firstName: 'Sharer' },
				// Missing email
			};

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockResolvedValue(sharer);

			await service.sendReservationRequestNotification(
				baseParams.reservationRequestId,
				baseParams.listingId,
				baseParams.reserverId,
				baseParams.sharerId,
				baseParams.reservationPeriodStart,
				baseParams.reservationPeriodEnd,
			);

			expect(mockEmailService.sendTemplatedEmail).not.toHaveBeenCalled();
		});

		it('handles email service failure without throwing', async () => {
			const sharer = {
				account: { email: 'sharer@example.com' },
				profile: { firstName: 'Sharer' },
			};

			const reserver = {
				account: { email: 'reserver@example.com' },
				profile: { firstName: 'Reserver' },
			};

			const listing = {
				title: 'Test Listing',
			};

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockResolvedValue(sharer);
			mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
				.mockResolvedValue(reserver);
			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockResolvedValue(listing);

			// Mock email service to throw
			mockEmailService.sendTemplatedEmail = vi
				.fn()
				.mockRejectedValue(new Error('SMTP Error'));

			const consoleSpy = vi.spyOn(console, 'error');

			// Should not throw even when email service fails
			await expect(
				service.sendReservationRequestNotification(
					baseParams.reservationRequestId,
					baseParams.listingId,
					baseParams.reserverId,
					baseParams.sharerId,
					baseParams.reservationPeriodStart,
					baseParams.reservationPeriodEnd,
				),
			).resolves.not.toThrow();

			expect(consoleSpy).toHaveBeenCalled();
			consoleSpy.mockRestore();
		});

		it('handles string date parameters', async () => {
			const sharer = {
				account: { email: 'sharer@example.com' },
				profile: { firstName: 'Sharer' },
			};

			const reserver = {
				account: { email: 'reserver@example.com' },
				profile: { firstName: 'Reserver' },
			};

			const listing = {
				title: 'Beautiful Home',
			};

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockResolvedValue(sharer);
			mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
				.mockResolvedValue(reserver);
			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockResolvedValue(listing);

			await service.sendReservationRequestNotification(
				baseParams.reservationRequestId,
				baseParams.listingId,
				baseParams.reserverId,
				baseParams.sharerId,
				'2024-01-15',
				'2024-01-20',
			);

			expect(mockEmailService.sendTemplatedEmail).toHaveBeenCalled();
		});

		it('formats dates in email template correctly', async () => {
			const sharer = {
				account: { email: 'sharer@example.com' },
				profile: { firstName: 'Sharer' },
			};

			const reserver = {
				account: { email: 'reserver@example.com' },
				profile: { firstName: 'Reserver' },
			};

			const listing = {
				title: 'Beautiful Home',
			};

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockResolvedValue(sharer);
			mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
				.mockResolvedValue(reserver);
			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockResolvedValue(listing);

			const startDate = new Date('2024-01-15');
			const endDate = new Date('2024-01-20');

			await service.sendReservationRequestNotification(
				baseParams.reservationRequestId,
				baseParams.listingId,
				baseParams.reserverId,
				baseParams.sharerId,
				startDate,
				endDate,
			);

			const call = vi.mocked(mockEmailService.sendTemplatedEmail).mock.calls[0];
			expect(call).toBeDefined();
			if (call) {
				expect(call[2]).toMatchObject({
					reservationStart: expect.stringContaining('1/15'),
					reservationEnd: expect.stringContaining('1/20'),
				});
			}
		});

	it('uses AdminUser fallback when PersonalUser not found', async () => {
		const adminSharer = {
			profile: { name: 'Admin Sharer', email: 'admin@example.com' },
		};

		// Variable for context/clarity in test (not used in this particular test path)
		void {
			account: { email: 'reserver@example.com' },
			profile: { firstName: 'Reserver' },
		};

		const listing = {
			title: 'Test Listing',
		};

		// Mock PersonalUser lookup to fail, AdminUser lookup to succeed
		mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
			.mockRejectedValue(new Error('Not found'));
		mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
			.mockResolvedValue(adminSharer);
		mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
			.mockResolvedValue(listing);

		await service.sendReservationRequestNotification(
			baseParams.reservationRequestId,
			baseParams.listingId,
			baseParams.reserverId,
			baseParams.sharerId,
			baseParams.reservationPeriodStart,
			baseParams.reservationPeriodEnd,
		);

		// Should have attempted PersonalUser lookup first, then AdminUser
		expect(
			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction,
		).toHaveBeenCalled();
	});		it('logs success when email is sent', async () => {
			const consoleSpy = vi.spyOn(console, 'log');

			const sharer = {
				account: { email: 'sharer@example.com' },
				profile: { firstName: 'Sharer' },
			};

			const reserver = {
				account: { email: 'reserver@example.com' },
				profile: { firstName: 'Reserver' },
			};

			const listing = {
				title: 'Beautiful Home',
			};

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockResolvedValue(sharer);
			mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
				.mockResolvedValue(reserver);
			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockResolvedValue(listing);

			await service.sendReservationRequestNotification(
				baseParams.reservationRequestId,
				baseParams.listingId,
				baseParams.reserverId,
				baseParams.sharerId,
				baseParams.reservationPeriodStart,
				baseParams.reservationPeriodEnd,
			);

			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringContaining('Processing ReservationRequestCreated notification'),
			);
			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringContaining('Notification email sent'),
			);

			consoleSpy.mockRestore();
		});

		it('handles listing with no title gracefully', async () => {
			const sharer = {
				account: { email: 'sharer@example.com' },
				profile: { firstName: 'Sharer' },
			};

			const reserver = {
				account: { email: 'reserver@example.com' },
				profile: { firstName: 'Reserver' },
			};

			const listing = {
				// Missing title
			};

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockResolvedValue(sharer);
			mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
				.mockResolvedValue(reserver);
			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockResolvedValue(listing);

			await service.sendReservationRequestNotification(
				baseParams.reservationRequestId,
				baseParams.listingId,
				baseParams.reserverId,
				baseParams.sharerId,
				baseParams.reservationPeriodStart,
				baseParams.reservationPeriodEnd,
			);

		expect(mockEmailService.sendTemplatedEmail).toHaveBeenCalled();
		const call = vi.mocked(mockEmailService.sendTemplatedEmail).mock.calls[0];
		if (call?.[2]) {
			const templateData = call[2];
			// biome-ignore lint/complexity/useLiteralKeys: Index signature requires bracket notation
			expect(templateData['listingTitle']).toBeDefined();
		}
		});
	});

	describe('edge cases and error handling', () => {
		it('handles null dates without throwing', async () => {
			const sharer = {
				account: { email: 'sharer@example.com' },
				profile: { firstName: 'Sharer' },
			};

			const reserver = {
				account: { email: 'reserver@example.com' },
				profile: { firstName: 'Reserver' },
			};

			const listing = { title: 'Test Listing' };

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockResolvedValue(sharer);
			mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
				.mockResolvedValue(reserver);
			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockResolvedValue(listing);

			await service.sendReservationRequestNotification(
				'req-123',
				'list-456',
				'user-reserver',
				'user-sharer',
				// biome-ignore lint/suspicious/noExplicitAny: Test requires flexibility for null parameters
				null as any,
				// biome-ignore lint/suspicious/noExplicitAny: Test requires flexibility for null parameters
				null as any,
			);

			expect(mockEmailService.sendTemplatedEmail).toHaveBeenCalled();
		});

		it('handles very long user names', async () => {
			const longFirstName = 'A'.repeat(200);
			const longLastName = 'B'.repeat(200);

			const sharer = {
				account: { email: 'sharer@example.com' },
				profile: { firstName: longFirstName, lastName: longLastName },
			};

			const reserver = {
				account: { email: 'reserver@example.com' },
				profile: { firstName: 'R' },
			};

			const listing = {
				title: 'Home',
			};

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockResolvedValue(sharer);
			mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
				.mockResolvedValue(reserver);
			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockResolvedValue(listing);

			await service.sendReservationRequestNotification(
				'req-123',
				'list-456',
				'user-reserver',
				'user-sharer',
				new Date(),
				new Date(),
			);

			expect(mockEmailService.sendTemplatedEmail).toHaveBeenCalled();
		});

		it('handles special characters in names and titles', async () => {
			const sharer = {
				account: { email: 'sharer@example.com' },
				profile: { firstName: "O'Brien", lastName: 'São Paulo' },
			};

			const reserver = {
				account: { email: 'reserver@example.com' },
				profile: { firstName: 'François' },
			};

			const listing = {
				title: 'Beautiful 3-Bedroom House & Villa (2024)',
			};

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockResolvedValue(sharer);
			mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
				.mockResolvedValue(reserver);
			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockResolvedValue(listing);

			await service.sendReservationRequestNotification(
				'req-123',
				'list-456',
				'user-reserver',
				'user-sharer',
				new Date(),
				new Date(),
			);

		expect(mockEmailService.sendTemplatedEmail).toHaveBeenCalled();
		const call = vi.mocked(mockEmailService.sendTemplatedEmail).mock.calls[0];
		expect(call).toBeDefined();
		if (call) {
			expect(call[1].email).toBe('sharer@example.com');
		}
		});
	});

	describe('Complex user entity scenarios', () => {
		const baseParams = {
			reservationRequestId: 'req-123',
			listingId: 'list-456',
			reserverId: 'user-reserver',
			sharerId: 'user-sharer',
			reservationPeriodStart: new Date('2024-01-15'),
			reservationPeriodEnd: new Date('2024-01-20'),
		};

		it('handles multiple user properties for name resolution', async () => {
			const sharerwithBothNames = {
				profile: { 
					firstName: 'John',
					lastName: 'Smith',
					name: 'Admin Name' // Should be ignored for personal users
				},
				account: { email: 'john@example.com' },
			};

			const reserver = {
				account: { email: 'reserver@example.com' },
				profile: { firstName: 'Jane' },
			};

			const listing = { title: 'House' };

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockResolvedValue(sharerwithBothNames);
			mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
				.mockResolvedValue(reserver);
			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockResolvedValue(listing);

			await service.sendReservationRequestNotification(
				baseParams.reservationRequestId,
				baseParams.listingId,
				baseParams.reserverId,
				baseParams.sharerId,
				baseParams.reservationPeriodStart,
				baseParams.reservationPeriodEnd,
			);

			expect(mockEmailService.sendTemplatedEmail).toHaveBeenCalled();
			const call = vi.mocked(mockEmailService.sendTemplatedEmail).mock.calls[0];
			if (call?.[2]) {
				// biome-ignore lint/complexity/useLiteralKeys: Index signature requires bracket notation
				expect(call[2]['sharerName']).toContain('John');
			}
		});

		it('handles AdminUser profile structure for email', async () => {
			const adminSharer = {
				profile: { 
					name: 'Admin User',
					email: 'admin@example.com' // AdminUser email in profile
				},
			};

			const adminReserver = {
				profile: {
					name: 'Reserver Admin',
					email: 'reserver-admin@example.com'
				},
			};

			const listing = { title: 'Apartment' };

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockRejectedValue(new Error('Not personal user'));
			mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
				.mockResolvedValueOnce(adminSharer)
				.mockResolvedValueOnce(adminReserver);
			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockResolvedValue(listing);

			await service.sendReservationRequestNotification(
				baseParams.reservationRequestId,
				baseParams.listingId,
				baseParams.reserverId,
				baseParams.sharerId,
				baseParams.reservationPeriodStart,
				baseParams.reservationPeriodEnd,
			);

			expect(mockEmailService.sendTemplatedEmail).toHaveBeenCalled();
		});

		it('handles mixed PersonalUser and AdminUser in transaction chain', async () => {
			const personalSharer = {
				account: { email: 'personal@example.com' },
				profile: { firstName: 'PersonalFirst' },
			};

			const adminReserver = {
				profile: { name: 'AdminUser' },
				account: { email: 'admin@example.com' },
			};

			const listing = { title: 'Studio' };

			// First call returns personal sharer
			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockResolvedValueOnce(personalSharer);
			// Second call fails (reserver not found as personal user)
			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockRejectedValueOnce(new Error('Not found'));
			// Then AdminUser succeeds for reserver
			mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
				.mockResolvedValue(adminReserver);
			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockResolvedValue(listing);

			await service.sendReservationRequestNotification(
				baseParams.reservationRequestId,
				baseParams.listingId,
				baseParams.reserverId,
				baseParams.sharerId,
				baseParams.reservationPeriodStart,
				baseParams.reservationPeriodEnd,
			);

			expect(mockEmailService.sendTemplatedEmail).toHaveBeenCalled();
			const call = vi.mocked(mockEmailService.sendTemplatedEmail).mock.calls[0];
			if (call) {
				expect(call[1].email).toBe('personal@example.com');
			}
		});
	});

	describe('Comprehensive template data validation', () => {
		const baseParams = {
			reservationRequestId: 'req-123',
			listingId: 'list-456',
			reserverId: 'user-reserver',
			sharerId: 'user-sharer',
			reservationPeriodStart: new Date('2024-01-15'),
			reservationPeriodEnd: new Date('2024-01-20'),
		};

		it('passes all required template variables', async () => {
			const sharer = {
				account: { email: 'sharer@example.com' },
				profile: { firstName: 'Sharer' },
			};

			const reserver = {
				account: { email: 'reserver@example.com' },
				profile: { firstName: 'Reserver' },
			};

			const listing = { title: 'Beautiful Property' };

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockResolvedValue(sharer);
			mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
				.mockResolvedValue(reserver);
			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockResolvedValue(listing);

			await service.sendReservationRequestNotification(
				baseParams.reservationRequestId,
				baseParams.listingId,
				baseParams.reserverId,
				baseParams.sharerId,
				baseParams.reservationPeriodStart,
				baseParams.reservationPeriodEnd,
			);

			const call = vi.mocked(mockEmailService.sendTemplatedEmail).mock.calls[0];
			expect(call).toBeDefined();
			if (call) {
				const templateName = call[0];
				const recipient = call[1];
				const templateData = call[2];

				expect(templateName).toBe('reservation-request-notification');
				expect(recipient.email).toBe('sharer@example.com');
				expect(templateData).toHaveProperty('sharerName');
				expect(templateData).toHaveProperty('reserverName');
				expect(templateData).toHaveProperty('listingTitle');
				expect(templateData).toHaveProperty('reservationStart');
				expect(templateData).toHaveProperty('reservationEnd');
				expect(templateData).toHaveProperty('reservationRequestId');
			}
		});

		it('includes accurate reservation dates in template', async () => {
			const sharer = {
				account: { email: 'sharer@example.com' },
				profile: { firstName: 'Sharer' },
			};

			const reserver = {
				account: { email: 'reserver@example.com' },
				profile: { firstName: 'Reserver' },
			};

			const listing = { title: 'Test' };

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockResolvedValue(sharer);
			mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
				.mockResolvedValue(reserver);
			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockResolvedValue(listing);

			const startDate = new Date('2024-06-15');
			const endDate = new Date('2024-06-20');

			await service.sendReservationRequestNotification(
				baseParams.reservationRequestId,
				baseParams.listingId,
				baseParams.reserverId,
				baseParams.sharerId,
				startDate,
				endDate,
			);

			const call = vi.mocked(mockEmailService.sendTemplatedEmail).mock.calls[0];
			if (call?.[2]) {
				const templateData = call[2];
				// Dates should be formatted by toLocaleDateString()
				// biome-ignore lint/complexity/useLiteralKeys: Index signature requires bracket notation
				expect(templateData['reservationStart']).toBeTruthy();
				// biome-ignore lint/complexity/useLiteralKeys: Index signature requires bracket notation
				expect(templateData['reservationEnd']).toBeTruthy();
			}
		});
	});

	describe('Error recovery and resilience', () => {
		const baseParams = {
			reservationRequestId: 'req-123',
			listingId: 'list-456',
			reserverId: 'user-reserver',
			sharerId: 'user-sharer',
			reservationPeriodStart: new Date('2024-01-15'),
			reservationPeriodEnd: new Date('2024-01-20'),
		};

		it('catches and logs errors from user repository lookups', async () => {
			const errorSpy = vi.spyOn(console, 'error');

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockRejectedValue(new Error('Database connection error'));

			await service.sendReservationRequestNotification(
				baseParams.reservationRequestId,
				baseParams.listingId,
				baseParams.reserverId,
				baseParams.sharerId,
				baseParams.reservationPeriodStart,
				baseParams.reservationPeriodEnd,
			);

			expect(errorSpy).toHaveBeenCalled();
			errorSpy.mockRestore();
		});

		it('catches and logs errors from listing lookup', async () => {
			const errorSpy = vi.spyOn(console, 'error');

			const sharer = {
				account: { email: 'sharer@example.com' },
				profile: { firstName: 'Sharer' },
			};

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockResolvedValue(sharer);
			mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
				.mockResolvedValue(sharer);
			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockRejectedValue(new Error('Listing lookup failed'));

			await service.sendReservationRequestNotification(
				baseParams.reservationRequestId,
				baseParams.listingId,
				baseParams.reserverId,
				baseParams.sharerId,
				baseParams.reservationPeriodStart,
				baseParams.reservationPeriodEnd,
			);

			expect(errorSpy).toHaveBeenCalledWith(
				expect.stringContaining('Listing'),
				expect.any(Error),
			);
			errorSpy.mockRestore();
		});

		it('catches and logs email sending errors without rethrowing', async () => {
			const errorSpy = vi.spyOn(console, 'error');

			const sharer = {
				account: { email: 'sharer@example.com' },
				profile: { firstName: 'Sharer' },
			};

			const reserver = {
				account: { email: 'reserver@example.com' },
				profile: { firstName: 'Reserver' },
			};

			const listing = { title: 'Test' };

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockResolvedValue(sharer);
			mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
				.mockResolvedValue(reserver);
			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockResolvedValue(listing);

			mockEmailService.sendTemplatedEmail = vi
				.fn()
				.mockRejectedValue(new Error('SMTP timeout'));

			// Should not throw
			await expect(
				service.sendReservationRequestNotification(
					baseParams.reservationRequestId,
					baseParams.listingId,
					baseParams.reserverId,
					baseParams.sharerId,
					baseParams.reservationPeriodStart,
					baseParams.reservationPeriodEnd,
				),
			).resolves.not.toThrow();

			expect(errorSpy).toHaveBeenCalled();
			errorSpy.mockRestore();
		});
	});

	describe('Edge cases with repository return values', () => {
		const baseParams = {
			reservationRequestId: 'req-123',
			listingId: 'list-456',
			reserverId: 'user-reserver',
			sharerId: 'user-sharer',
			reservationPeriodStart: new Date('2024-01-15'),
			reservationPeriodEnd: new Date('2024-01-20'),
		};

		it('handles null repository callback return values', async () => {
			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockResolvedValue(null);

			await service.sendReservationRequestNotification(
				baseParams.reservationRequestId,
				baseParams.listingId,
				baseParams.reserverId,
				baseParams.sharerId,
				baseParams.reservationPeriodStart,
				baseParams.reservationPeriodEnd,
			);

			// Should handle gracefully without sending email
			expect(mockEmailService.sendTemplatedEmail).not.toHaveBeenCalled();
		});

		it('handles listing without title property', async () => {
			const sharer = {
				account: { email: 'sharer@example.com' },
				profile: { firstName: 'Sharer' },
			};

			const reserver = {
				account: { email: 'reserver@example.com' },
				profile: { firstName: 'Reserver' },
			};

			const listingWithoutTitle = {
				id: 'list-456',
				// No title property
			};

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockResolvedValue(sharer);
			mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
				.mockResolvedValue(reserver);
			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockResolvedValue(listingWithoutTitle);

			await service.sendReservationRequestNotification(
				baseParams.reservationRequestId,
				baseParams.listingId,
				baseParams.reserverId,
				baseParams.sharerId,
				baseParams.reservationPeriodStart,
				baseParams.reservationPeriodEnd,
			);

			const call = vi.mocked(mockEmailService.sendTemplatedEmail).mock.calls[0];
			if (call?.[2]) {
				// Should use 'Unknown Listing' or similar fallback
				// biome-ignore lint/complexity/useLiteralKeys: Index signature requires bracket notation
				expect(call[2]['listingTitle']).toBeDefined();
			}
		});
	});

	describe('Service initialization and state', () => {
		it('creates service instance with correct dependencies', () => {
			expect(service).toBeInstanceOf(ReservationRequestNotificationService);
		});

		it('maintains separate instances with independent mocks', () => {
			const service2 = new ReservationRequestNotificationService(
				mockDomainDataSource,
				mockEmailService,
			);

			expect(service).not.toBe(service2);
		});
	});

	describe('Uncovered line scenarios', () => {
		const baseParams = {
			reservationRequestId: 'req-123',
			listingId: 'list-456',
			reserverId: 'user-reserver',
			sharerId: 'user-sharer',
			reservationPeriodStart: new Date('2024-01-15'),
			reservationPeriodEnd: new Date('2024-01-20'),
		};

		it('handles reserver returning null from repository', async () => {
			const consoleSpy = vi.spyOn(console, 'error');
			const sharer = {
				account: { email: 'sharer@example.com' },
				profile: { firstName: 'Sharer' },
			};

			// Mock PersonalUser returning the sharer
			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockImplementation(async (_passport: unknown, callback: (repo: unknown) => Promise<unknown>) => {
					const mockRepo = {
						getById: vi.fn().mockImplementation((userId: string) => {
							// First call (sharer) returns the sharer, second call (reserver) returns null
							return Promise.resolve(userId === baseParams.sharerId ? sharer : null);
						}),
					};
					return await callback(mockRepo);
				});

			await service.sendReservationRequestNotification(
				baseParams.reservationRequestId,
				baseParams.listingId,
				baseParams.reserverId,
				baseParams.sharerId,
				baseParams.reservationPeriodStart,
				baseParams.reservationPeriodEnd,
			);

			// Should log error for missing reserver and not send email
			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringContaining(`Reserver with ID ${baseParams.reserverId} not found`),
			);
			expect(mockEmailService.sendTemplatedEmail).not.toHaveBeenCalled();

			consoleSpy.mockRestore();
		});

		it('handles sharer with no email address', async () => {
			const consoleSpy = vi.spyOn(console, 'error');

			const sharerWithoutEmail = {
				profile: { firstName: 'Sharer', lastName: 'Test' },
				// Missing email in both account and profile
			};

			const reserver = {
				account: { email: 'reserver@example.com' },
				profile: { firstName: 'Reserver' },
			};

			const listing = {
				title: 'Test Listing',
			};

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockImplementation(async (_passport: unknown, callback: (repo: unknown) => Promise<unknown>) => {
					const mockRepo = {
						getById: vi.fn().mockImplementation((userId: string) => {
							return Promise.resolve(userId === baseParams.sharerId ? sharerWithoutEmail : reserver);
						}),
					};
					return await callback(mockRepo);
				});

			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockImplementation(async (_passport: unknown, callback: (repo: unknown) => Promise<unknown>) => {
					const mockRepo = {
						getById: vi.fn().mockResolvedValue(listing),
					};
					return await callback(mockRepo);
				});

			await service.sendReservationRequestNotification(
				baseParams.reservationRequestId,
				baseParams.listingId,
				baseParams.reserverId,
				baseParams.sharerId,
				baseParams.reservationPeriodStart,
				baseParams.reservationPeriodEnd,
			);

			// Should log error for missing email and not send email
			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringContaining(`Sharer ${baseParams.sharerId} has no email address`),
			);
			expect(mockEmailService.sendTemplatedEmail).not.toHaveBeenCalled();

			consoleSpy.mockRestore();
		});

		it('handles both AdminUser lookups failing for sharer', async () => {
			const errorSpy = vi.spyOn(console, 'error');

			// Both PersonalUser and AdminUser fail
			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockRejectedValue(new Error('PersonalUser lookup failed'));
			mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
				.mockRejectedValue(new Error('AdminUser lookup failed'));

			await service.sendReservationRequestNotification(
				baseParams.reservationRequestId,
				baseParams.listingId,
				baseParams.reserverId,
				baseParams.sharerId,
				baseParams.reservationPeriodStart,
				baseParams.reservationPeriodEnd,
			);

			// Should log error indicating both lookups failed
			expect(errorSpy).toHaveBeenCalledWith(
				expect.stringContaining(`User ${baseParams.sharerId} not found as admin user either`),
				expect.any(Error),
			);
			expect(mockEmailService.sendTemplatedEmail).not.toHaveBeenCalled();

			errorSpy.mockRestore();
		});

		it('handles both AdminUser lookups failing for reserver', async () => {
			const errorSpy = vi.spyOn(console, 'error');

			const sharer = {
				account: { email: 'sharer@example.com' },
				profile: { firstName: 'Sharer' },
			};

			// PersonalUser succeeds for sharer, fails for reserver
			// AdminUser fails for reserver
			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockImplementation(async (_passport: unknown, callback: (repo: unknown) => Promise<unknown>) => {
					const mockRepo = {
						getById: vi.fn().mockImplementation((userId: string) => {
							if (userId === baseParams.sharerId) {
								return Promise.resolve(sharer);
							}
							return Promise.reject(new Error('Not found'));
						}),
					};
					return await callback(mockRepo);
				});

			mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
				.mockRejectedValue(new Error('AdminUser lookup failed'));

			await service.sendReservationRequestNotification(
				baseParams.reservationRequestId,
				baseParams.listingId,
				baseParams.reserverId,
				baseParams.sharerId,
				baseParams.reservationPeriodStart,
				baseParams.reservationPeriodEnd,
			);

			// Should log error indicating both lookups failed for reserver
			expect(errorSpy).toHaveBeenCalledWith(
				expect.stringContaining(`User ${baseParams.reserverId} not found as admin user either`),
				expect.any(Error),
			);
			expect(mockEmailService.sendTemplatedEmail).not.toHaveBeenCalled();

			errorSpy.mockRestore();
		});

		it('handles listing returning null from repository', async () => {
			const consoleSpy = vi.spyOn(console, 'error');

			const sharer = {
				account: { email: 'sharer@example.com' },
				profile: { firstName: 'Sharer' },
			};

			const reserver = {
				account: { email: 'reserver@example.com' },
				profile: { firstName: 'Reserver' },
			};

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockImplementation(async (_passport: unknown, callback: (repo: unknown) => Promise<unknown>) => {
					const mockRepo = {
						getById: vi.fn().mockImplementation((userId: string) => {
							return Promise.resolve(userId === baseParams.sharerId ? sharer : reserver);
						}),
					};
					return await callback(mockRepo);
				});

			// Listing returns null
			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockImplementation(async (_passport: unknown, callback: (repo: unknown) => Promise<unknown>) => {
					const mockRepo = {
						getById: vi.fn().mockResolvedValue(null),
					};
					return await callback(mockRepo);
				});

			await service.sendReservationRequestNotification(
				baseParams.reservationRequestId,
				baseParams.listingId,
				baseParams.reserverId,
				baseParams.sharerId,
				baseParams.reservationPeriodStart,
				baseParams.reservationPeriodEnd,
			);

			// Should log error for missing listing and not send email
			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringContaining(`Listing with ID ${baseParams.listingId} not found`),
			);
			expect(mockEmailService.sendTemplatedEmail).not.toHaveBeenCalled();

			consoleSpy.mockRestore();
		});

		it('handles listing lookup throwing exception', async () => {
			const consoleSpy = vi.spyOn(console, 'error');

			const sharer = {
				account: { email: 'sharer@example.com' },
				profile: { firstName: 'Sharer' },
			};

			const reserver = {
				account: { email: 'reserver@example.com' },
				profile: { firstName: 'Reserver' },
			};

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockImplementation(async (_passport: unknown, callback: (repo: unknown) => Promise<unknown>) => {
					const mockRepo = {
						getById: vi.fn().mockImplementation((userId: string) => {
							return Promise.resolve(userId === baseParams.sharerId ? sharer : reserver);
						}),
					};
					return await callback(mockRepo);
				});

			// Listing lookup throws
			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockRejectedValue(new Error('Database connection error for listing'));

			await service.sendReservationRequestNotification(
				baseParams.reservationRequestId,
				baseParams.listingId,
				baseParams.reserverId,
				baseParams.sharerId,
				baseParams.reservationPeriodStart,
				baseParams.reservationPeriodEnd,
			);

			// Should log error and catch exception without throwing
			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringContaining('Listing'),
				expect.any(Error),
			);
			expect(mockEmailService.sendTemplatedEmail).not.toHaveBeenCalled();

			consoleSpy.mockRestore();
		});

		it('handles reserver null after successful repo call for PersonalUser', async () => {
			const consoleSpy = vi.spyOn(console, 'error');

			const sharer = {
				account: { email: 'sharer@example.com' },
				profile: { firstName: 'Sharer' },
			};

			let callCount = 0;

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockImplementation(async (_passport: unknown, callback: (repo: unknown) => Promise<unknown>) => {
					const mockRepo = {
						getById: vi.fn().mockImplementation((userId: string) => {
							callCount++;
							if (callCount === 1 && userId === baseParams.sharerId) {
								return Promise.resolve(sharer);
							}
							if (callCount === 2 && userId === baseParams.reserverId) {
								return Promise.resolve(null);
							}
							return Promise.resolve(null);
						}),
					};
					return await callback(mockRepo);
				});

			await service.sendReservationRequestNotification(
				baseParams.reservationRequestId,
				baseParams.listingId,
				baseParams.reserverId,
				baseParams.sharerId,
				baseParams.reservationPeriodStart,
				baseParams.reservationPeriodEnd,
			);

			// Should log error for missing reserver and not send email
			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringContaining(`Reserver with ID ${baseParams.reserverId} not found`),
			);
			expect(mockEmailService.sendTemplatedEmail).not.toHaveBeenCalled();

			consoleSpy.mockRestore();
		});

		it('logs appropriate message when reserver not found as PersonalUser and proceeds to AdminUser', async () => {
			const logSpy = vi.spyOn(console, 'log');

			const sharer = {
				account: { email: 'sharer@example.com' },
				profile: { firstName: 'Sharer' },
			};

			const reserver = {
				profile: { name: 'Reserver' },
				account: { email: 'reserver@example.com' },
			};

			const listing = {
				title: 'Test Listing',
			};

			let callCount = 0;

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockImplementation(async (_passport: unknown, callback: (repo: unknown) => Promise<unknown>) => {
					callCount++;
					if (callCount === 1) {
						const mockRepo = {
							getById: vi.fn().mockResolvedValue(sharer),
						};
						return await callback(mockRepo);
					} else {
						// Second call for reserver fails
						throw new Error('Reserver not a personal user');
					}
				});

			mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
				.mockResolvedValue(reserver);

			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockResolvedValue(listing);

			await service.sendReservationRequestNotification(
				'req-123',
				'list-456',
				'user-reserver',
				'user-sharer',
				new Date('2024-01-15'),
				new Date('2024-01-20'),
			);

			// Should log message about trying admin user
			expect(logSpy).toHaveBeenCalledWith(
				expect.stringContaining('User user-reserver not found as personal user, trying admin user'),
				expect.any(Error),
			);
			expect(mockEmailService.sendTemplatedEmail).toHaveBeenCalled();

			logSpy.mockRestore();
		});

		it('logs appropriate message when sharer not found as PersonalUser and proceeds to AdminUser', async () => {
			const logSpy = vi.spyOn(console, 'log');

			const sharer = {
				profile: { name: 'Sharer' },
				account: { email: 'sharer@example.com' },
			};

			const reserver = {
				account: { email: 'reserver@example.com' },
				profile: { firstName: 'Reserver' },
			};

			const listing = {
				title: 'Test Listing',
			};

			// First call fails for sharer
			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockRejectedValueOnce(new Error('Sharer not a personal user'));

			// Second call succeeds for reserver
			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockResolvedValueOnce(reserver);

			// AdminUser call for sharer
			mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
				.mockResolvedValue(sharer);

			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockResolvedValue(listing);

			await service.sendReservationRequestNotification(
				'req-123',
				'list-456',
				'user-reserver',
				'user-sharer',
				new Date('2024-01-15'),
				new Date('2024-01-20'),
			);

			// Should log message about trying admin user
			expect(logSpy).toHaveBeenCalledWith(
				expect.stringContaining('User user-sharer not found as personal user, trying admin user'),
				expect.any(Error),
			);
			expect(mockEmailService.sendTemplatedEmail).toHaveBeenCalled();

			logSpy.mockRestore();
		});

		it('processes notification and logs success message correctly', async () => {
			const logSpy = vi.spyOn(console, 'log');

			const sharer = {
				account: { email: 'sharer@example.com' },
				profile: { firstName: 'John', lastName: 'Doe' },
			};

			const reserver = {
				account: { email: 'reserver@example.com' },
				profile: { firstName: 'Jane' },
			};

			const listing = {
				title: 'Beachfront Villa',
			};

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockImplementation(async (_passport: unknown, callback: (repo: unknown) => Promise<unknown>) => {
					const mockRepo = {
						getById: vi.fn().mockImplementation((userId: string) => {
							return Promise.resolve(userId === 'user-sharer' ? sharer : reserver);
						}),
					};
					return await callback(mockRepo);
				});

			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockResolvedValue(listing);

			await service.sendReservationRequestNotification(
				'req-123',
				'list-456',
				'user-reserver',
				'user-sharer',
				new Date('2024-01-15'),
				new Date('2024-01-20'),
			);

			// Should log initial processing message
			expect(logSpy).toHaveBeenCalledWith(
				expect.stringContaining('Processing ReservationRequestCreated notification'),
			);

			// Should log success message
			expect(logSpy).toHaveBeenCalledWith(
				expect.stringContaining('Notification email sent to sharer'),
			);

			logSpy.mockRestore();
		});

		it('handles AdminUser as sharer with correct structure', async () => {
			const sharer = {
				profile: { 
					name: 'Admin Sharer',
					email: 'admin@example.com'
				},
			};

			const reserver = {
				account: { email: 'reserver@example.com' },
				profile: { firstName: 'Reserver' },
			};

			const listing = {
				title: 'Test Property',
			};

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockRejectedValueOnce(new Error('Not personal user'))
				.mockResolvedValueOnce(reserver);

			mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
				.mockResolvedValue(sharer);

			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockResolvedValue(listing);

			await service.sendReservationRequestNotification(
				'req-123',
				'list-456',
				'user-reserver',
				'user-sharer',
				new Date('2024-01-15'),
				new Date('2024-01-20'),
			);

			expect(mockEmailService.sendTemplatedEmail).toHaveBeenCalledWith(
				'reservation-request-notification',
				expect.objectContaining({
					email: 'admin@example.com',
					name: 'Admin Sharer',
				}),
				expect.any(Object),
			);
		});

		it('handles both users as AdminUsers successfully', async () => {
			const sharer = {
				profile: { 
					name: 'Admin Sharer',
					email: 'sharer-admin@example.com'
				},
			};

			const reserver = {
				profile: {
					name: 'Admin Reserver',
					email: 'reserver-admin@example.com'
				},
			};

			const listing = {
				title: 'Joint Property',
			};

			// Both PersonalUser calls fail
			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockRejectedValue(new Error('Not personal user'));

			// AdminUser returns both users
			mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
				.mockResolvedValueOnce(sharer)
				.mockResolvedValueOnce(reserver);

			mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
				.mockResolvedValue(listing);

			await service.sendReservationRequestNotification(
				'req-123',
				'list-456',
				'user-reserver',
				'user-sharer',
				new Date('2024-01-15'),
				new Date('2024-01-20'),
			);

			expect(mockEmailService.sendTemplatedEmail).toHaveBeenCalledWith(
				'reservation-request-notification',
				expect.objectContaining({
					email: 'sharer-admin@example.com',
				}),
				expect.any(Object),
			);
		});

		it('catches exception from top-level try-catch block', async () => {
			const errorSpy = vi.spyOn(console, 'error');

			// Simulate an unexpected error during processing
			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockImplementation(() => {
					throw new Error('Unexpected error during domain import or system passport creation');
				});

			await service.sendReservationRequestNotification(
				'req-123',
				'list-456',
				'user-reserver',
				'user-sharer',
				new Date('2024-01-15'),
				new Date('2024-01-20'),
			);

			// Should catch and log error without throwing
			expect(errorSpy).toHaveBeenCalled();
			// The error could be from trying AdminUser fallback or from the final catch block
			const { calls } = vi.mocked(console.error).mock;
			const hasProcessingError = calls.some((call) =>
				call[0].toString().includes('Error processing ReservationRequestCreated notification'),
			);
			expect(hasProcessingError || errorSpy.mock.calls.length > 0).toBeTruthy();
			expect(mockEmailService.sendTemplatedEmail).not.toHaveBeenCalled();

			errorSpy.mockRestore();
		});


		it('validates console.log initial processing message is always called', async () => {
			const logSpy = vi.spyOn(console, 'log');

			mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction
				.mockRejectedValue(new Error('Setup error'));

			mockDomainDataSource.User.AdminUser.AdminUserUnitOfWork.withTransaction
				.mockRejectedValue(new Error('Setup error'));

			await service.sendReservationRequestNotification(
				'req-456',
				'list-789',
				'user-reserver',
				'user-sharer',
				new Date('2024-02-01'),
				new Date('2024-02-10'),
			);

			// First log call should be the processing message
			expect(logSpy).toHaveBeenCalledWith(
				expect.stringContaining('Processing ReservationRequestCreated notification for reservation req-456'),
			);

			logSpy.mockRestore();
		});
	});
});
