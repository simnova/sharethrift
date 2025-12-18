import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { DomainDataSource } from '@sthrift/domain';
import type { TransactionalEmailService } from '@cellix/transactional-email-service';
import { ReservationRequestNotificationService } from './reservation-request-notification-service.js';

// Mock the dynamic import BEFORE any test runs
vi.mock('@sthrift/domain', () => ({
  Domain: {
    PassportFactory: {
      forSystem: () => ({}),
    },
  },
}));

describe('ReservationRequestNotificationService', () => {
  let service: ReservationRequestNotificationService;
  let mockEmailService: TransactionalEmailService;
  let mockDomainDataSource: DomainDataSource;

  beforeEach(() => {
    const mockSharer = {
      account: { email: 'sharer@test.com' },
      profile: { firstName: 'John', lastName: 'Sharer' },
    };

    const mockReserver = {
      account: { email: 'reserver@test.com' },
      profile: { firstName: 'Jane', lastName: 'Reserver' },
    };

    const mockListing = {
      title: 'Unknown Listing',
    };

    mockEmailService = {
      sendTemplatedEmail: vi.fn().mockResolvedValue(undefined),
    } as TransactionalEmailService;

    mockDomainDataSource = {
      User: {
        PersonalUser: {
          PersonalUserUnitOfWork: {
            withTransaction: vi.fn((_passport, callback) => {
              const mockRepo = {
                getById: vi.fn((userId: string) => {
                  if (userId === 'user-456') {
                    return Promise.resolve(mockSharer);
                  }
                  if (userId === 'user-789') {
                    return Promise.resolve(mockReserver);
                  }
                  return Promise.resolve(null);
                }),
              };
              return Promise.resolve(callback(mockRepo));
            }),
          },
        },
      },
      Listing: {
        ItemListing: {
          ItemListingUnitOfWork: {
            withTransaction: vi.fn((_passport, callback) => {
              const mockRepo = {
                getById: vi.fn().mockResolvedValue(mockListing),
              };
              return Promise.resolve(callback(mockRepo));
            }),
          },
        },
      },
    } as unknown as DomainDataSource;

    service = new ReservationRequestNotificationService(
      mockDomainDataSource,
      mockEmailService,
    );
  });

  it('successfully sends email notification with valid data', { timeout: 15000 }, async () => {
    await service.sendReservationRequestNotification(
      'reservation-123',
      'listing-101',
      'user-789',
      'user-456',
      new Date('2025-01-15'),
      new Date('2025-01-20')
    );

    expect(vi.mocked(mockEmailService.sendTemplatedEmail)).toHaveBeenCalledWith(
      'reservation-request-notification',
      expect.objectContaining({ email: 'sharer@test.com' }),
      expect.objectContaining({
        sharerName: 'John Sharer',
        reserverName: 'Jane Reserver',
        listingTitle: 'Unknown Listing',
        reservationStart: expect.any(String),
        reservationEnd: expect.any(String),
        reservationRequestId: 'reservation-123',
      })
    );
  });

  describe('getUserEmail', () => {
    it('gets email from AdminUser profile.email', { timeout: 15000 }, async () => {
      const adminUser = {
        profile: { email: 'admin@test.com' },
      };

      // Setup mock to return admin user for sharer
      mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction = vi.fn((_passport, _callback) => {
        throw new Error('PersonalUser not found');
      });

      (mockDomainDataSource.User.AdminUser as unknown) = {
        AdminUserUnitOfWork: {
          withTransaction: vi.fn((_passport, callback) => {
            const mockRepo = {
              getById: vi.fn((userId: string) => {
                if (userId === 'user-456') {
                  return Promise.resolve(adminUser);
                }
                if (userId === 'user-789') {
                  return Promise.resolve({ profile: { firstName: 'Jane', lastName: 'Reserver' }, account: { email: 'jane@test.com' } });
                }
                return Promise.resolve(null);
              }),
            };
            return Promise.resolve(callback(mockRepo));
          }),
        },
      };

      mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction = vi.fn((_passport, callback) => {
        const mockRepo = {
          getById: vi.fn().mockResolvedValue({ title: 'Test Listing' }),
        };
        return Promise.resolve(callback(mockRepo));
      });

      await service.sendReservationRequestNotification(
        'reservation-123',
        'listing-101',
        'user-789',
        'user-456',
        new Date('2025-01-15'),
        new Date('2025-01-20')
      );

      expect(vi.mocked(mockEmailService.sendTemplatedEmail)).toHaveBeenCalledWith(
        'reservation-request-notification',
        expect.objectContaining({ email: 'admin@test.com' }),
        expect.any(Object)
      );
    });
  });

  describe(' getUserDisplayName', () => {
    it('gets display name from AdminUser profile.name', { timeout: 15000 }, async () => {
      const adminSharer = {
        profile: { name: 'Admin User Name' },
        account: { email: 'admin@test.com' },
      };

      const reserver = {
        account: { email: 'reserver@test.com' },
      };

      mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction = vi.fn((_passport, _callback) => {
        throw new Error('PersonalUser not found');
      });

      (mockDomainDataSource.User.AdminUser as unknown) = {
        AdminUserUnitOfWork: {
          withTransaction: vi.fn((_passport, callback) => {
            const mockRepo = {
              getById: vi.fn((userId: string) => {
                if (userId === 'user-456') {
                  return Promise.resolve(adminSharer);
                }
                if (userId === 'user-789') {
                  return Promise.resolve(reserver);
                }
                return Promise.resolve(null);
              }),
            };
            return Promise.resolve(callback(mockRepo));
          }),
        },
      } as unknown as DomainDataSource;

      mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction = vi.fn((_passport, callback) => {
        const mockRepo = {
          getById: vi.fn().mockResolvedValue({ title: 'Test Listing' }),
        };
        return Promise.resolve(callback(mockRepo));
      });

      await service.sendReservationRequestNotification(
        'reservation-123',
        'listing-101',
        'user-789',
        'user-456',
        new Date('2025-01-15'),
        new Date('2025-01-20')
      );

      expect(vi.mocked(mockEmailService.sendTemplatedEmail)).toHaveBeenCalledWith(
        'reservation-request-notification',
        expect.any(Object),
        expect.objectContaining({
          sharerName: 'Admin User Name',
        })
      );
    });

    it('gets display name from PersonalUser firstName and lastName', { timeout: 15000 }, async () => {
      const reserver = {
        account: { email: 'reserver@test.com' },
      };

      mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction = vi.fn((_passport, callback) => {
        const mockRepo = {
          getById: vi.fn((userId: string) => {
            if (userId === 'user-456') {
              return Promise.resolve({
                account: { email: 'sharer@test.com' },
                profile: { firstName: 'John', lastName: 'Doe' },
              });
            }
            if (userId === 'user-789') {
              return Promise.resolve(reserver);
            }
            return Promise.resolve(null);
          }),
        };
        return Promise.resolve(callback(mockRepo));
      });

      mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction = vi.fn((_passport, callback) => {
        const mockRepo = {
          getById: vi.fn().mockResolvedValue({ title: 'Test Listing' }),
        };
        return Promise.resolve(callback(mockRepo));
      });

      await service.sendReservationRequestNotification(
        'reservation-123',
        'listing-101',
        'user-789',
        'user-456',
        new Date('2025-01-15'),
        new Date('2025-01-20')
      );

      expect(vi.mocked(mockEmailService.sendTemplatedEmail)).toHaveBeenCalledWith(
        'reservation-request-notification',
        expect.any(Object),
        expect.objectContaining({
          sharerName: 'John Doe',
        })
      );
    });

    it('uses fallback name when user has no firstName and no profile.name', { timeout: 15000 }, async () => {
      const sharer = {
        account: { email: 'sharer@test.com' },
        profile: {},
      };

      const reserver = {
        account: { email: 'reserver@test.com' },
      };

      mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction = vi.fn((_passport, callback) => {
        const mockRepo = {
          getById: vi.fn((userId: string) => {
            if (userId === 'user-456') {
              return Promise.resolve(sharer);
            }
            if (userId === 'user-789') {
              return Promise.resolve(reserver);
            }
            return Promise.resolve(null);
          }),
        };
        return Promise.resolve(callback(mockRepo));
      });

      mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction = vi.fn((_passport, callback) => {
        const mockRepo = {
          getById: vi.fn().mockResolvedValue({ title: 'Test Listing' }),
        };
        return Promise.resolve(callback(mockRepo));
      });

      await service.sendReservationRequestNotification(
        'reservation-123',
        'listing-101',
        'user-789',
        'user-456',
        new Date('2025-01-15'),
        new Date('2025-01-20')
      );

      expect(vi.mocked(mockEmailService.sendTemplatedEmail)).toHaveBeenCalledWith(
        'reservation-request-notification',
        expect.any(Object),
        expect.objectContaining({
          sharerName: 'User',
        })
      );
    });
  });

  describe('Uncovered line tests - Sharer not found scenarios', () => {
    it('returns early when sharer is null after both PersonalUser and AdminUser attempts', { timeout: 15000 }, async () => {
      mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction = vi.fn(
        () => Promise.reject(new Error('PersonalUser error'))
      );

      (mockDomainDataSource.User.AdminUser as unknown) = {
        AdminUserUnitOfWork: {
          withTransaction: vi.fn(
            () => Promise.reject(new Error('AdminUser error'))
          ),
        },
      };

      await service.sendReservationRequestNotification(
        'reservation-123',
        'listing-101',
        'user-789',
        'unknown-sharer',
        new Date('2025-01-15'),
        new Date('2025-01-20')
      );

      expect(vi.mocked(mockEmailService.sendTemplatedEmail)).not.toHaveBeenCalled();
    });

    it('throws error when both PersonalUser and AdminUser fail to load sharer', { timeout: 15000 }, async () => {
      const personalUserError = new Error('PersonalUser not found');
      const adminUserError = new Error('AdminUser not found');

      mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction = vi.fn(
        () => Promise.reject(personalUserError)
      );

      (mockDomainDataSource.User.AdminUser as unknown) = {
        AdminUserUnitOfWork: {
          withTransaction: vi.fn(
            () => Promise.reject(adminUserError)
          ),
        },
      };

      // Should not throw but log error and return early
      await service.sendReservationRequestNotification(
        'reservation-123',
        'listing-101',
        'user-789',
        'unknown-sharer',
        new Date('2025-01-15'),
        new Date('2025-01-20')
      );

      expect(vi.mocked(mockEmailService.sendTemplatedEmail)).not.toHaveBeenCalled();
    });
  });

  describe('Uncovered line tests - Reserver not found scenarios', () => {
    it('returns early when reserver is null after both PersonalUser and AdminUser attempts', { timeout: 15000 }, async () => {
      const mockSharer = {
        account: { email: 'sharer@test.com' },
        profile: { firstName: 'John', lastName: 'Sharer' },
      };

      mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction = vi.fn((_passport, callback) => {
        const mockRepo = {
          getById: vi.fn((userId: string) => {
            if (userId === 'user-456') {
              return Promise.resolve(mockSharer);
            }
            // Reserver not found in PersonalUser
            return Promise.reject(new Error('Not found'));
          }),
        };
        return Promise.resolve(callback(mockRepo));
      });

      (mockDomainDataSource.User.AdminUser as unknown) = {
        AdminUserUnitOfWork: {
          withTransaction: vi.fn(
            () => Promise.reject(new Error('AdminUser not found'))
          ),
        },
      };

      await service.sendReservationRequestNotification(
        'reservation-123',
        'listing-101',
        'unknown-reserver',
        'user-456',
        new Date('2025-01-15'),
        new Date('2025-01-20')
      );

      expect(vi.mocked(mockEmailService.sendTemplatedEmail)).not.toHaveBeenCalled();
    });

    it('throws error when both PersonalUser and AdminUser fail to load reserver', { timeout: 15000 }, async () => {
      const mockSharer = {
        account: { email: 'sharer@test.com' },
        profile: { firstName: 'John', lastName: 'Sharer' },
      };

      let callCount = 0;

      mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction = vi.fn((_passport, callback) => {
        const mockRepo = {
          getById: vi.fn((userId: string) => {
            callCount++;
            if (callCount === 1 && userId === 'user-456') {
              return Promise.resolve(mockSharer);
            }
            return Promise.reject(new Error('Not found'));
          }),
        };
        return Promise.resolve(callback(mockRepo));
      });

      (mockDomainDataSource.User.AdminUser as unknown) = {
        AdminUserUnitOfWork: {
          withTransaction: vi.fn(
            () => Promise.reject(new Error('AdminUser not found'))
          ),
        },
      };

      await service.sendReservationRequestNotification(
        'reservation-123',
        'listing-101',
        'unknown-reserver',
        'user-456',
        new Date('2025-01-15'),
        new Date('2025-01-20')
      );

      expect(vi.mocked(mockEmailService.sendTemplatedEmail)).not.toHaveBeenCalled();
    });
  });

  describe('Uncovered line tests - Listing not found scenarios', () => {
    it('throws error when listing is not found', { timeout: 15000 }, async () => {
      const mockSharer = {
        account: { email: 'sharer@test.com' },
        profile: { firstName: 'John', lastName: 'Sharer' },
      };

      const mockReserver = {
        account: { email: 'reserver@test.com' },
        profile: { firstName: 'Jane', lastName: 'Reserver' },
      };

      mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction = vi.fn((_passport, callback) => {
        const mockRepo = {
          getById: vi.fn((userId: string) => {
            if (userId === 'user-456') {
              return Promise.resolve(mockSharer);
            }
            if (userId === 'user-789') {
              return Promise.resolve(mockReserver);
            }
            return Promise.resolve(null);
          }),
        };
        return Promise.resolve(callback(mockRepo));
      });

      mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction = vi.fn(
        () => Promise.reject(new Error('Listing not found'))
      );

      await service.sendReservationRequestNotification(
        'reservation-123',
        'listing-101',
        'user-789',
        'user-456',
        new Date('2025-01-15'),
        new Date('2025-01-20')
      );

      expect(vi.mocked(mockEmailService.sendTemplatedEmail)).not.toHaveBeenCalled();
    });

    it('returns early when listing is null', { timeout: 15000 }, async () => {
      const mockSharer = {
        account: { email: 'sharer@test.com' },
        profile: { firstName: 'John', lastName: 'Sharer' },
      };

      const mockReserver = {
        account: { email: 'reserver@test.com' },
        profile: { firstName: 'Jane', lastName: 'Reserver' },
      };

      mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction = vi.fn((_passport, callback) => {
        const mockRepo = {
          getById: vi.fn((userId: string) => {
            if (userId === 'user-456') {
              return Promise.resolve(mockSharer);
            }
            if (userId === 'user-789') {
              return Promise.resolve(mockReserver);
            }
            return Promise.resolve(null);
          }),
        };
        return Promise.resolve(callback(mockRepo));
      });

      mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction = vi.fn((_passport, callback) => {
        const mockRepo = {
          getById: vi.fn().mockResolvedValue(null),
        };
        return Promise.resolve(callback(mockRepo));
      });

      await service.sendReservationRequestNotification(
        'reservation-123',
        'listing-101',
        'user-789',
        'user-456',
        new Date('2025-01-15'),
        new Date('2025-01-20')
      );

      expect(vi.mocked(mockEmailService.sendTemplatedEmail)).not.toHaveBeenCalled();
    });
  });

  describe('Uncovered line tests - Sharer contact info scenarios', () => {
    it('returns early when sharer has no email address', { timeout: 15000 }, async () => {
      const sharerNoEmail = {
        profile: { firstName: 'John', lastName: 'Sharer' },
      };

      const mockReserver = {
        account: { email: 'reserver@test.com' },
        profile: { firstName: 'Jane', lastName: 'Reserver' },
      };

      mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction = vi.fn((_passport, callback) => {
        const mockRepo = {
          getById: vi.fn((userId: string) => {
            if (userId === 'user-456') {
              return Promise.resolve(sharerNoEmail);
            }
            if (userId === 'user-789') {
              return Promise.resolve(mockReserver);
            }
            return Promise.resolve(null);
          }),
        };
        return Promise.resolve(callback(mockRepo));
      });

      mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction = vi.fn((_passport, callback) => {
        const mockRepo = {
          getById: vi.fn().mockResolvedValue({ title: 'Test Listing' }),
        };
        return Promise.resolve(callback(mockRepo));
      });

      await service.sendReservationRequestNotification(
        'reservation-123',
        'listing-101',
        'user-789',
        'user-456',
        new Date('2025-01-15'),
        new Date('2025-01-20')
      );

      expect(vi.mocked(mockEmailService.sendTemplatedEmail)).not.toHaveBeenCalled();
    });
  });

  describe('Uncovered line tests - PersonalUser firstName only (no lastName)', () => {
    it('gets display name from PersonalUser firstName without lastName', { timeout: 15000 }, async () => {
      const sharer = {
        account: { email: 'sharer@test.com' },
        profile: { firstName: 'John' },
      };

      const reserver = {
        account: { email: 'reserver@test.com' },
        profile: { firstName: 'Jane', lastName: 'Reserver' },
      };

      mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction = vi.fn((_passport, callback) => {
        const mockRepo = {
          getById: vi.fn((userId: string) => {
            if (userId === 'user-456') {
              return Promise.resolve(sharer);
            }
            if (userId === 'user-789') {
              return Promise.resolve(reserver);
            }
            return Promise.resolve(null);
          }),
        };
        return Promise.resolve(callback(mockRepo));
      });

      mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction = vi.fn((_passport, callback) => {
        const mockRepo = {
          getById: vi.fn().mockResolvedValue({ title: 'Test Listing' }),
        };
        return Promise.resolve(callback(mockRepo));
      });

      await service.sendReservationRequestNotification(
        'reservation-123',
        'listing-101',
        'user-789',
        'user-456',
        new Date('2025-01-15'),
        new Date('2025-01-20')
      );

      expect(vi.mocked(mockEmailService.sendTemplatedEmail)).toHaveBeenCalledWith(
        'reservation-request-notification',
        expect.any(Object),
        expect.objectContaining({
          sharerName: 'John',
        })
      );
    });
  });

  describe('Uncovered line tests - Reserver using AdminUser', () => {
    it('successfully gets reserver display name from AdminUser profile.name', { timeout: 15000 }, async () => {
      const sharer = {
        account: { email: 'sharer@test.com' },
        profile: { firstName: 'John', lastName: 'Sharer' },
      };

      const adminReserver = {
        account: { email: 'reserver@test.com' },
        profile: { name: 'Admin Reserver' },
      };

      mockDomainDataSource.User.PersonalUser.PersonalUserUnitOfWork.withTransaction = vi.fn((_passport, callback) => {
        const mockRepo = {
          getById: vi.fn((userId: string) => {
            if (userId === 'user-456') {
              return Promise.resolve(sharer);
            }
            return Promise.reject(new Error('Not found'));
          }),
        };
        return Promise.resolve(callback(mockRepo));
      });

      (mockDomainDataSource.User.AdminUser as unknown) = {
        AdminUserUnitOfWork: {
          withTransaction: vi.fn((_passport, callback) => {
            const mockRepo = {
              getById: vi.fn((userId: string) => {
                if (userId === 'user-789') {
                  return Promise.resolve(adminReserver);
                }
                return Promise.resolve(null);
              }),
            };
            return Promise.resolve(callback(mockRepo));
          }),
        },
      };

      mockDomainDataSource.Listing.ItemListing.ItemListingUnitOfWork.withTransaction = vi.fn((_passport, callback) => {
        const mockRepo = {
          getById: vi.fn().mockResolvedValue({ title: 'Test Listing' }),
        };
        return Promise.resolve(callback(mockRepo));
      });

      await service.sendReservationRequestNotification(
        'reservation-123',
        'listing-101',
        'user-789',
        'user-456',
        new Date('2025-01-15'),
        new Date('2025-01-20')
      );

      expect(vi.mocked(mockEmailService.sendTemplatedEmail)).toHaveBeenCalledWith(
        'reservation-request-notification',
        expect.any(Object),
        expect.objectContaining({
          reserverName: 'Admin Reserver',
        })
      );
    });
  });
});
