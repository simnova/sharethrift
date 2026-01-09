import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Timer, InvocationContext } from '@azure/functions';
import type { ApplicationServicesFactory } from '@sthrift/application-services';
import { expiredListingDeletionHandlerCreator } from './expired-listing-deletion-handler.ts';

// Mock OpenTelemetry
vi.mock('@opentelemetry/api', () => ({
	trace: {
		getTracer: () => ({
			startActiveSpan: vi.fn(async (_name, callback) => {
				const mockSpan = {
					setAttribute: vi.fn(),
					setStatus: vi.fn(),
					recordException: vi.fn(),
					end: vi.fn(),
				};
				return await callback(mockSpan);
			}),
		}),
	},
	SpanStatusCode: {
		OK: 1,
		ERROR: 2,
	},
}));

describe('expiredListingDeletionHandler', () => {
	let mockContext: InvocationContext;
	let mockTimer: Timer;
	let mockFactory: ApplicationServicesFactory;
	let mockProcessExpiredDeletions: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockContext = {
			log: vi.fn(),
			error: vi.fn(),
		} as unknown as InvocationContext;

		mockTimer = {
			isPastDue: false,
			schedule: {
				adjustForDST: false,
			},
			scheduleStatus: {
				last: new Date().toISOString(),
				next: new Date().toISOString(),
				lastUpdated: new Date().toISOString(),
			},
		};

		mockProcessExpiredDeletions = vi.fn().mockResolvedValue({
			deletedCount: 5,
			deletedListingIds: ['id1', 'id2', 'id3', 'id4', 'id5'],
			deletedConversationsCount: 10,
			deletedImagesCount: 15,
			errors: [],
		});

		mockFactory = {
			forSystemTask: vi.fn().mockReturnValue({
				Listing: {
					ItemListing: {
						processExpiredDeletions: mockProcessExpiredDeletions,
					},
				},
			}),
		} as unknown as ApplicationServicesFactory;
	});

	it('should call processExpiredDeletions and log success', async () => {
		const handler = expiredListingDeletionHandlerCreator(mockFactory);
		await handler(mockTimer, mockContext);

		expect(mockFactory.forSystemTask).toHaveBeenCalledOnce();
		expect(mockProcessExpiredDeletions).toHaveBeenCalledOnce();
		expect(mockContext.log).toHaveBeenCalledWith('ExpiredListingDeletion: Timer triggered');
		expect(mockContext.log).toHaveBeenCalledWith(
			'ExpiredListingDeletion: Completed - 5 deleted, 0 errors',
		);
	});

	it('should log past due message when timer is past due', async () => {
		mockTimer.isPastDue = true;
		const handler = expiredListingDeletionHandlerCreator(mockFactory);
		await handler(mockTimer, mockContext);

		expect(mockContext.log).toHaveBeenCalledWith('ExpiredListingDeletion: Timer is past due');
	});

	it('should log errors when processExpiredDeletions returns errors', async () => {
		const errors = [{ listingId: 'failed-1', error: 'Delete failed' }];
		mockProcessExpiredDeletions.mockResolvedValue({
			deletedCount: 2,
			deletedListingIds: ['id1', 'id2'],
			deletedConversationsCount: 4,
			deletedImagesCount: 6,
			errors,
		});

		const handler = expiredListingDeletionHandlerCreator(mockFactory);
		await handler(mockTimer, mockContext);

		expect(mockContext.log).toHaveBeenCalledWith(
			'ExpiredListingDeletion: Completed - 2 deleted, 1 errors',
		);
		expect(mockContext.log).toHaveBeenCalledWith(
			`ExpiredListingDeletion: Errors: ${JSON.stringify(errors)}`,
		);
	});

	it('should throw and log error when processExpiredDeletions fails', async () => {
		const testError = new Error('Database connection failed');
		mockProcessExpiredDeletions.mockRejectedValue(testError);

		const handler = expiredListingDeletionHandlerCreator(mockFactory);

		await expect(handler(mockTimer, mockContext)).rejects.toThrow('Database connection failed');
		expect(mockContext.error).toHaveBeenCalledWith(
			'ExpiredListingDeletion: Failed - Database connection failed',
		);
	});
});
