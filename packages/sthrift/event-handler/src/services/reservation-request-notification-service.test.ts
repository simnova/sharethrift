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
});
