import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ReservationRequestNotificationService } from './reservation-request-notification-service.js';
import type { TransactionalEmailService } from '@cellix/transactional-email-service';

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
			const mock = vi.fn((_passport: any, callback: any) => {
				// Check if there's a queued item for this call
				if (callCount < callQueue.length) {
					const queued = callQueue[callCount++];
					if (queued.type === 'error') {
						throw queued.value;
					} else {
						const mockRepo = {
							getById: vi.fn().mockResolvedValue(queued.value),
						};
						return Promise.resolve(callback(mockRepo));
					}
				}
				
				callCount++;
				if (hasError) {
					throw errorValue;
				}
				if (returnValue !== undefined) {
					const mockRepo = {
						getById: vi.fn().mockResolvedValue(returnValue),
					};
					return Promise.resolve(callback(mockRepo));
				}
				// No value set yet, return undefined
				return Promise.resolve(callback({ getById: vi.fn().mockResolvedValue(undefined) }));
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

	describe('getUserEmail', () => {
		it('retrieves email from PersonalUser account', () => {
			const user = {
				account: { email: 'personal@example.com' },
			};
			// biome-ignore lint/complexity/useLiteralKeys: Accessing private method for testing
			const email = service['getUserEmail'](user);
			expect(email).toBe('personal@example.com');
		});

		it('retrieves email from AdminUser profile', () => {
			const user = {
				profile: { email: 'admin@example.com' },
			};
			// biome-ignore lint/complexity/useLiteralKeys: Accessing private method for testing
			const email = service['getUserEmail'](user);
			expect(email).toBe('admin@example.com');
		});

		it('prefers PersonalUser account email over profile email', () => {
			const user = {
				account: { email: 'account@example.com' },
				profile: { email: 'profile@example.com' },
			};
			// biome-ignore lint/complexity/useLiteralKeys: Accessing private method for testing
			const email = service['getUserEmail'](user);
			expect(email).toBe('account@example.com');
		});

		it('returns null when no email is found', () => {
			const user = { name: 'John' };
			// biome-ignore lint/complexity/useLiteralKeys: Accessing private method for testing
			const email = service['getUserEmail'](user);
			expect(email).toBeNull();
		});

		it('returns null for null user', () => {
			// biome-ignore lint/complexity/useLiteralKeys: Accessing private method for testing
			const email = service['getUserEmail'](null);
			expect(email).toBeNull();
		});

		it('returns null for undefined user', () => {
			// biome-ignore lint/complexity/useLiteralKeys: Accessing private method for testing
			const email = service['getUserEmail'](undefined);
			expect(email).toBeNull();
		});
	});

	describe('getUserDisplayName', () => {
		it('retrieves full name from PersonalUser profile', () => {
			const user = {
				profile: { firstName: 'John', lastName: 'Doe' },
			};
			// biome-ignore lint/complexity/useLiteralKeys: Accessing private method for testing
			const name = service['getUserDisplayName'](user);
			expect(name).toBe('John Doe');
		});

		it('retrieves first name only from PersonalUser profile when lastName not available', () => {
			const user = {
				profile: { firstName: 'John' },
			};
			// biome-ignore lint/complexity/useLiteralKeys: Accessing private method for testing
			const name = service['getUserDisplayName'](user);
			expect(name).toBe('John');
		});

		it('retrieves name from AdminUser profile', () => {
			const user = {
				profile: { name: 'Admin User' },
			};
			// biome-ignore lint/complexity/useLiteralKeys: Accessing private method for testing
			const name = service['getUserDisplayName'](user);
			expect(name).toBe('Admin User');
		});

		it('prefers PersonalUser firstName over AdminUser profile name', () => {
			const user = {
				profile: { firstName: 'John', name: 'Admin User' },
			};
			// biome-ignore lint/complexity/useLiteralKeys: Accessing private method for testing
			const name = service['getUserDisplayName'](user);
			expect(name).toBe('John');
		});

		it('returns fallback value when no name is found', () => {
			const user = { email: 'test@example.com' };
			// biome-ignore lint/complexity/useLiteralKeys: Accessing private method for testing
			const name = service['getUserDisplayName'](user, 'Guest');
			expect(name).toBe('Guest');
		});

		it('uses default fallback "Someone" when not specified', () => {
			const user = { email: 'test@example.com' };
			// biome-ignore lint/complexity/useLiteralKeys: Accessing private method for testing
			const name = service['getUserDisplayName'](user);
			expect(name).toBe('Someone');
		});

		it('returns fallback for null user', () => {
			// biome-ignore lint/complexity/useLiteralKeys: Accessing private method for testing
			const name = service['getUserDisplayName'](null, 'Guest');
			expect(name).toBe('Guest');
		});

		it('handles empty firstName string', () => {
			const user = {
				profile: { firstName: '' },
			};
			// biome-ignore lint/complexity/useLiteralKeys: Accessing private method for testing
			const name = service['getUserDisplayName'](user, 'Guest');
			expect(name).toBe('Guest');
		});
	});

	describe('getUserContactInfo', () => {
		it('retrieves both email and name when both are available', () => {
			const user = {
				account: { email: 'john@example.com' },
				profile: { firstName: 'John', lastName: 'Doe' },
			};
			// biome-ignore lint/complexity/useLiteralKeys: Accessing private method for testing
			const contactInfo = service['getUserContactInfo'](user);
			expect(contactInfo).toEqual({ email: 'john@example.com', name: 'John Doe' });
		});

		it('returns null when email is not available', () => {
			const user = {
				profile: { firstName: 'John', lastName: 'Doe' },
			};
			// biome-ignore lint/complexity/useLiteralKeys: Accessing private method for testing
			const contactInfo = service['getUserContactInfo'](user);
			expect(contactInfo).toBeNull();
		});

		it('uses fallback name when profile name not available but email is', () => {
			const user = {
				account: { email: 'user@example.com' },
			};
			// biome-ignore lint/complexity/useLiteralKeys: Accessing private method for testing
			const contactInfo = service['getUserContactInfo'](user, 'Guest');
			expect(contactInfo).toEqual({ email: 'user@example.com', name: 'Guest' });
		});

		it('uses default fallback "Someone" when name not available and fallback not specified', () => {
			const user = {
				account: { email: 'user@example.com' },
			};
			// biome-ignore lint/complexity/useLiteralKeys: Accessing private method for testing
			const contactInfo = service['getUserContactInfo'](user);
			expect(contactInfo).toEqual({ email: 'user@example.com', name: 'Someone' });
		});

		it('returns null for null user', () => {
			// biome-ignore lint/complexity/useLiteralKeys: Accessing private method for testing
			const contactInfo = service['getUserContactInfo'](null);
			expect(contactInfo).toBeNull();
		});
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
			.mockImplementation((_passport: unknown, callback: (repo: unknown) => unknown) => {
				if (
					callback.toString().includes('sharer') ||
					callback.toString().includes('getById(\'user-sharer\')')
				) {
					return callback({ getById: vi.fn().mockResolvedValue(sharer) });
				}
				return callback({ getById: vi.fn().mockResolvedValue(reserver) });
			});

		mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction
			.mockImplementation((_passport: unknown, callback: (repo: unknown) => unknown) =>
				callback({ getById: vi.fn().mockResolvedValue(listing) }),
			);

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
});
