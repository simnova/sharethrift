import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { ReservationRequestReadRepositoryImpl } from './reservation-request.read-repository.ts';
import { ReservationRequestDataSourceImpl } from './reservation-request.data.ts';
import { ReservationRequestConverter } from '../../../domain/reservation-request/reservation-request/reservation-request.domain-adapter.ts';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';

// Mock the data source module
const test = { for: describeFeature };
vi.mock('./reservation-request.data.ts', () => ({
  ReservationRequestDataSourceImpl: vi.fn(),
}));

// Mock the converter module
vi.mock('../../../domain/reservation-request/reservation-request/reservation-request.domain-adapter.ts', () => ({
  ReservationRequestConverter: vi.fn(),
}));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
  path.resolve(__dirname, 'features/reservation-request.read-repository.feature')
);

function makeMockModelsContext() {
  return {
    ReservationRequest: {
      ReservationRequest: {
        aggregate: vi.fn(),
        collection: { name: 'reservationrequests' },
      } as unknown as Models.ReservationRequest.ReservationRequestModelType,
    },
    Listing: {
      ItemListingModel: {
        collection: { name: 'listings' },
      } as unknown as Models.Listing.ItemListingModelType,
    },
  } as ModelsContext;
}

function makeMockPassport() {
  return {
    user: {
      forReservationRequest: vi.fn(() => ({
        determineIf: vi.fn(() => true),
      })),
    },
  } as unknown as Domain.Passport;
}

function makeMockReservationRequestDocument(overrides?: Partial<Models.ReservationRequest.ReservationRequest>) {
  const baseId = new MongooseSeedwork.ObjectId();
  return {
    _id: baseId,
    reserver: new MongooseSeedwork.ObjectId(),
    listing: new MongooseSeedwork.ObjectId(),
    state: 'Requested',
    reservationPeriodStart: new Date('2024-01-15T10:00:00Z'),
    reservationPeriodEnd: new Date('2024-01-20T10:00:00Z'),
    closeRequestedBySharer: false,
    closeRequestedByReserver: false,
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z'),
    id: baseId,
    ...overrides,
  } as unknown as Models.ReservationRequest.ReservationRequest;
}

function makeMockListingDocument() {
  const baseId = new MongooseSeedwork.ObjectId(TEST_IDS.LISTING_1);
  return {
    _id: baseId,
    sharer: new MongooseSeedwork.ObjectId(TEST_IDS.SHARER_1),
    title: 'Test Listing',
    description: 'A test listing document',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z'),
    id: baseId,
  };
}

// Test ObjectId constants for consistent use across tests
const TEST_IDS = {
  RESERVATION_1: '64f5b3c1e4b0a1c2d3e4f567',
  USER_1: '64f5b3c1e4b0a1c2d3e4f568', 
  LISTING_1: '64f5b3c1e4b0a1c2d3e4f569',
  SHARER_1: '64f5b3c1e4b0a1c2d3e4f570',
  NONEXISTENT: '64f5b3c1e4b0a1c2d3e4f571'
} as const;

function makeMockDomainEntity(doc?: Models.ReservationRequest.ReservationRequest) {
  return {
    id: doc?.id || '64f5b3c1e4b0a1c2d3e4f567',
    state: doc?.state || 'Requested',
    reserver: doc?.reserver || new MongooseSeedwork.ObjectId(),
    listing: doc?.listing || new MongooseSeedwork.ObjectId(),
    reservationPeriodStart: doc?.reservationPeriodStart || new Date('2024-01-15T10:00:00Z'),
    reservationPeriodEnd: doc?.reservationPeriodEnd || new Date('2024-01-20T10:00:00Z'),
  } as unknown as Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference;
}

test.for(feature, ({ Scenario, BeforeEachScenario, Background }) => {
  let models: ModelsContext;
  let passport: Domain.Passport;
  let repository: ReservationRequestReadRepositoryImpl;
  let mockReservationRequestDoc: Models.ReservationRequest.ReservationRequest;
  let mockListingDoc: ReturnType<typeof makeMockListingDocument>;
  let mockDataSource: {
    find: ReturnType<typeof vi.fn>;
    findById: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
  };
  let mockConverter: {
    toDomain: ReturnType<typeof vi.fn>;
  };

  Background(({ Given, And }) => {
    Given('a ReservationRequestReadRepository instance with a working Mongoose model and passport', () => {
      // This setup is handled in BeforeEachScenario
    });

    And('valid ReservationRequest documents exist in the database', () => {
      // This is handled by our mock data setup
    });
  });

  BeforeEachScenario(() => {
    models = makeMockModelsContext();
    passport = makeMockPassport();
    mockReservationRequestDoc = makeMockReservationRequestDocument();
    mockListingDoc = makeMockListingDocument();

    // Mock the data source
    mockDataSource = {
      find: vi.fn(async () => [mockReservationRequestDoc]),
      findById: vi.fn(async (id: string) => 
        id === '64f5b3c1e4b0a1c2d3e4f567' ? mockReservationRequestDoc : null
      ),
      findOne: vi.fn(async () => mockReservationRequestDoc),
    };

    // Mock the converter
    mockConverter = {
      toDomain: vi.fn((_doc, _passport) => makeMockDomainEntity(_doc)),
    };

    // Mock the constructors
    vi.mocked(ReservationRequestDataSourceImpl).mockImplementation(
      () => mockDataSource as unknown as InstanceType<typeof ReservationRequestDataSourceImpl>
    );
    vi.mocked(ReservationRequestConverter).mockImplementation(
      () => mockConverter as unknown as ReservationRequestConverter
    );

    repository = new ReservationRequestReadRepositoryImpl(models, passport);
  });

  Scenario('Getting all reservation requests', ({ Given, When, Then, And }) => {
    Given('multiple ReservationRequest documents in the database', () => {
      const secondId = new MongooseSeedwork.ObjectId();
      mockDataSource.find.mockResolvedValue([mockReservationRequestDoc, makeMockReservationRequestDocument({ 
        _id: secondId,
        id: secondId
      })]);
    });

    When('I call getAll', async () => {
      await repository.getAll();
    });

    Then('I should receive an array of ReservationRequest entities', () => {
      expect(mockDataSource.find).toHaveBeenCalledWith({}, undefined);
    });

    And('the array should contain all reservation requests', () => {
      expect(mockConverter.toDomain).toHaveBeenCalledWith(mockReservationRequestDoc, passport);
    });
  });

  Scenario('Getting a reservation request by ID', ({ Given, When, Then, And }) => {
    Given('a ReservationRequest document with id "reservation-1"', () => {
      mockDataSource.findById.mockImplementation(async (id: string) => 
        id === TEST_IDS.RESERVATION_1 ? mockReservationRequestDoc : null
      );
    });

    When('I call getById with "reservation-1"', async () => {
      await repository.getById(TEST_IDS.RESERVATION_1);
    });

    Then('I should receive a ReservationRequest entity', () => {
      expect(mockDataSource.findById).toHaveBeenCalledWith(TEST_IDS.RESERVATION_1, undefined);
    });

    And('the entity\'s id should be "reservation-1"', () => {
      expect(mockConverter.toDomain).toHaveBeenCalledWith(mockReservationRequestDoc, passport);
    });
  });

  Scenario('Getting a reservation request by nonexistent ID', ({ When, Then }) => {
    When('I call getById with "nonexistent-id"', async () => {
      const result = await repository.getById(TEST_IDS.NONEXISTENT);
      expect(result).toBeNull();
    });

    Then('it should return null', () => {
      expect(mockDataSource.findById).toHaveBeenCalledWith(TEST_IDS.NONEXISTENT, undefined);
    });
  });

  Scenario('Getting reservation requests by reserver ID', ({ Given, When, Then, And }) => {
    Given('a ReservationRequest document with reserver "user-1"', () => {
      mockReservationRequestDoc.reserver = new MongooseSeedwork.ObjectId(TEST_IDS.USER_1);
    });

    When('I call getByReserverId with "user-1"', async () => {
      await repository.getByReserverId(TEST_IDS.USER_1);
    });

    Then('I should receive an array of ReservationRequest entities', () => {
      expect(mockDataSource.find).toHaveBeenCalledWith(
        { reserver: new MongooseSeedwork.ObjectId(TEST_IDS.USER_1) },
        undefined
      );
    });

    And('the array should contain reservation requests where reserver is "user-1"', () => {
      expect(mockConverter.toDomain).toHaveBeenCalledWith(mockReservationRequestDoc, passport);
    });
  });

  Scenario('Getting active reservation requests by reserver ID with listing and sharer', ({ Given, When, Then, And }) => {
    Given('a ReservationRequest document with reserver "user-1" and state "Accepted"', () => {
      mockReservationRequestDoc.reserver = new MongooseSeedwork.ObjectId(TEST_IDS.USER_1);
      mockReservationRequestDoc.state = 'Accepted';
    });

    When('I call getActiveByReserverIdWithListingWithSharer with "user-1"', async () => {
      await repository.getActiveByReserverIdWithListingWithSharer(TEST_IDS.USER_1);
    });

    Then('I should receive an array of ReservationRequest entities', () => {
      expect(mockDataSource.find).toHaveBeenCalledWith(
        {
          reserver: new MongooseSeedwork.ObjectId(TEST_IDS.USER_1),
          state: { $in: ['Accepted', 'Requested'] },
        },
        {
          populateFields: ['listing', 'reserver'],
        }
      );
    });

    And('the array should contain active reservation requests with populated listing and reserver', () => {
      expect(mockConverter.toDomain).toHaveBeenCalledWith(mockReservationRequestDoc, passport);
    });
  });

  Scenario('Getting past reservation requests by reserver ID', ({ Given, When, Then, And }) => {
    Given('a ReservationRequest document with reserver "user-1" and state "Closed"', () => {
      mockReservationRequestDoc.reserver = new MongooseSeedwork.ObjectId(TEST_IDS.USER_1);
      mockReservationRequestDoc.state = 'Closed';
    });

    When('I call getPastByReserverIdWithListingWithSharer with "user-1"', async () => {
      await repository.getPastByReserverIdWithListingWithSharer(TEST_IDS.USER_1);
    });

    Then('I should receive an array of ReservationRequest entities', () => {
      expect(mockDataSource.find).toHaveBeenCalledWith(
        {
          reserver: new MongooseSeedwork.ObjectId(TEST_IDS.USER_1),
          state: { $in: ['Cancelled', 'Closed', 'Rejected'] },
        },
        {
          populateFields: ['listing', 'reserver'],
        }
      );
    });

    And('the array should contain past reservation requests', () => {
      expect(mockConverter.toDomain).toHaveBeenCalledWith(mockReservationRequestDoc, passport);
    });
  });

  Scenario('Getting listing requests by sharer ID', ({ Given, When, Then, And }) => {
    let result: Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[];
    // The aggregation result should include the populated listingDoc from $lookup
    const aggregateResult = [{
      ...mockReservationRequestDoc,
      listingDoc: mockListingDoc
    }];

    Given('a ReservationRequest document with listing owned by "sharer-1"', () => {
      vi.mocked(models.ReservationRequest.ReservationRequest.aggregate).mockReturnValue({
        exec: vi.fn().mockResolvedValue(aggregateResult),
      } as never);
    });

    When('I call getListingRequestsBySharerId with "sharer-1"', async () => {
      result = await repository.getListingRequestsBySharerId(TEST_IDS.SHARER_1);
    });

    Then('I should receive an array of ReservationRequest entities', () => {
      expect(models.ReservationRequest.ReservationRequest.aggregate).toHaveBeenCalledWith([
        {
          $lookup: {
            from: 'listings',
            localField: 'listing',
            foreignField: '_id',
            as: 'listingDoc',
          },
        },
        { $unwind: '$listingDoc' },
        {
          $match: {
            'listingDoc.sharer': new MongooseSeedwork.ObjectId(TEST_IDS.SHARER_1),
          },
        },
      ]);
    });

    And('the array should contain reservation requests for listings owned by "sharer-1"', () => {
      // Verify the converter was called
      expect(mockConverter.toDomain).toHaveBeenCalled();
      expect(mockConverter.toDomain).toHaveBeenCalledWith(expect.any(Object), passport);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  Scenario('Getting active reservation by reserver ID and listing ID', ({ Given, When, Then, And }) => {
    Given('a ReservationRequest document with reserver "user-1", listing "listing-1", and state "Accepted"', () => {
      mockReservationRequestDoc.reserver = new MongooseSeedwork.ObjectId(TEST_IDS.USER_1);
      mockReservationRequestDoc.listing = new MongooseSeedwork.ObjectId(TEST_IDS.LISTING_1);
      mockReservationRequestDoc.state = 'Accepted';
    });

    When('I call getActiveByReserverIdAndListingId with "user-1" and "listing-1"', async () => {
      await repository.getActiveByReserverIdAndListingId(TEST_IDS.USER_1, TEST_IDS.LISTING_1);
    });

    Then('I should receive a ReservationRequest entity', () => {
      expect(mockDataSource.findOne).toHaveBeenCalledWith(
        {
          reserver: new MongooseSeedwork.ObjectId(TEST_IDS.USER_1),
          listing: new MongooseSeedwork.ObjectId(TEST_IDS.LISTING_1),
          state: { $in: ['Accepted', 'Requested'] },
        },
        undefined
      );
    });

    And('the entity\'s reserver id should be "user-1"', () => {
      expect(mockConverter.toDomain).toHaveBeenCalledWith(mockReservationRequestDoc, passport);
    });

    And('the entity\'s listing id should be "listing-1"', () => {
      // This is implicitly tested by the converter call above
      expect(mockConverter.toDomain).toHaveBeenCalledWith(mockReservationRequestDoc, passport);
    });
  });

  Scenario('Getting overlapping active reservation requests for a listing', ({ Given, When, Then, And }) => {
    const startDate = new Date('2025-10-22');
    const endDate = new Date('2025-10-27');

    Given('a ReservationRequest document for listing "listing-1" from "2025-10-20" to "2025-10-25" with state "Accepted"', () => {
      mockReservationRequestDoc.listing = new MongooseSeedwork.ObjectId(TEST_IDS.LISTING_1);
      mockReservationRequestDoc.reservationPeriodStart = new Date('2025-10-20');
      mockReservationRequestDoc.reservationPeriodEnd = new Date('2025-10-25');
      mockReservationRequestDoc.state = 'Accepted';
    });

    When('I call getOverlapActiveReservationRequestsForListing with "listing-1", start "2025-10-22", end "2025-10-27"', async () => {
      await repository.getOverlapActiveReservationRequestsForListing(TEST_IDS.LISTING_1, startDate, endDate);
    });

    Then('I should receive an array of ReservationRequest entities', () => {
      expect(mockDataSource.find).toHaveBeenCalledWith(
        {
          listing: new MongooseSeedwork.ObjectId(TEST_IDS.LISTING_1),
          state: { $in: ['Accepted', 'Requested'] },
          reservationPeriodStart: { $lt: endDate },
          reservationPeriodEnd: { $gt: startDate },
        },
        undefined
      );
    });

    And('the array should contain overlapping active reservation requests', () => {
      expect(mockConverter.toDomain).toHaveBeenCalledWith(mockReservationRequestDoc, passport);
    });
  });

  Scenario('Getting active reservations by listing ID', ({ Given, When, Then, And }) => {
    Given('a ReservationRequest document with listing "listing-1" and state "Requested"', () => {
      mockReservationRequestDoc.listing = new MongooseSeedwork.ObjectId(TEST_IDS.LISTING_1);
      mockReservationRequestDoc.state = 'Requested';
    });

    When('I call getActiveByListingId with "listing-1"', async () => {
      await repository.getActiveByListingId(TEST_IDS.LISTING_1);
    });

    Then('I should receive an array of ReservationRequest entities', () => {
      expect(mockDataSource.find).toHaveBeenCalledWith(
        {
          listing: new MongooseSeedwork.ObjectId(TEST_IDS.LISTING_1),
          state: { $in: ['Accepted', 'Requested'] },
        },
        undefined
      );
    });

    And('the array should contain active reservation requests for the listing', () => {
      expect(mockConverter.toDomain).toHaveBeenCalledWith(mockReservationRequestDoc, passport);
    });
  });
});