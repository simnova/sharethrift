import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ReservationRequestRepository } from './reservation-request.repository.ts';
import { ReservationRequestConverter } from './reservation-request.domain-adapter.ts';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { Domain } from '@sthrift/domain';
import type { Model } from 'mongoose';

describe('ReservationRequestRepository', () => {
	let repository: ReservationRequestRepository;
	let mockModel: Partial<Model<Models.ReservationRequest.ReservationRequest>>;
	let mockPassport: Domain.Passport;
	let mockConverter: ReservationRequestConverter;
		let mockEventBus: { dispatch: ReturnType<typeof vi.fn> };
		let mockSession: unknown;

		beforeEach(() => {
			// Reset mocks each test
			mockModel = {
				findById: vi.fn().mockReturnValue({ populate: vi.fn().mockReturnValue({ exec: vi.fn() }) }),
				find: vi.fn().mockReturnValue({ populate: vi.fn().mockReturnValue({ exec: vi.fn() }) }),
			} as unknown as Partial<Model<Models.ReservationRequest.ReservationRequest>>;
			mockPassport = {} as Domain.Passport;
			mockConverter = new ReservationRequestConverter();
			// biome-ignore lint/suspicious/noExplicitAny: test mock requires any for event bus interface
			mockEventBus = { dispatch: vi.fn().mockResolvedValue(undefined) } as any;
			// biome-ignore lint/suspicious/noExplicitAny: test mock requires any for session interface
			mockSession = {} as any;

			repository = new ReservationRequestRepository(
				mockPassport,
				mockModel as Model<Models.ReservationRequest.ReservationRequest>,
				mockConverter,
				// biome-ignore lint/suspicious/noExplicitAny: test mock requires any for event bus interface
				mockEventBus as any,
				// biome-ignore lint/suspicious/noExplicitAny: test mock requires any for session interface
				mockSession as any,
			);
		});

	it('should be instantiated with correct parameters', () => {
		expect(repository).toBeDefined();
		expect(repository).toBeInstanceOf(ReservationRequestRepository);
	});

	it('should have getById method', () => {
		expect(typeof repository.getById).toBe('function');
	});

  it('should have getAll method', () => {
    expect(typeof repository.getAll).toBe('function');
  });

	it('should have getNewInstance method', () => {
		expect(typeof repository.getNewInstance).toBe('function');
	});

	it('getById should throw when not found', async () => {
		// simulate exec returning null
		const populateMock = vi.fn().mockReturnValue({ exec: vi.fn().mockResolvedValue(null) });
		// biome-ignore lint/suspicious/noExplicitAny: test mock requires any for type flexibility
		(mockModel.findById as any).mockReturnValue({ populate: populateMock });
		await expect(repository.getById('missing-id')).rejects.toThrow(/not found/);
	});

	it('getById should return converted domain object', async () => {
		const fakeDoc = { _id: 'abc', listing: {}, reserver: {} };
		// biome-ignore lint/suspicious/noExplicitAny: test requires any for ReservationRequest generic type
		const converted = { id: 'abc' } as unknown as Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<any>;
		vi.spyOn(mockConverter, 'toDomain').mockReturnValue(converted);
		const execMock = vi.fn().mockResolvedValue(fakeDoc);
		const populateMock = vi.fn().mockReturnValue({ exec: execMock });
		// biome-ignore lint/suspicious/noExplicitAny: test mock requires any for type flexibility
		(mockModel.findById as any).mockReturnValue({ populate: populateMock });
		const result = await repository.getById('abc');
		expect(result).toBe(converted);
		expect(mockConverter.toDomain).toHaveBeenCalledWith(fakeDoc, mockPassport);
	});

	it('getAll should return converted domain objects', async () => {
		const fakeDocs = [
			{ _id: '1', listing: {}, reserver: {} },
			{ _id: '2', listing: {}, reserver: {} },
		];
		// biome-ignore lint/suspicious/noExplicitAny: test mock requires any for type flexibility
		vi.spyOn(mockConverter, 'toDomain').mockImplementation((doc) => ({ id: (doc as any)._id }) as any);
		const execMock = vi.fn().mockResolvedValue(fakeDocs);
		const populateMock = vi.fn().mockReturnValue({ exec: execMock });
		// biome-ignore lint/suspicious/noExplicitAny: test mock requires any for type flexibility
		(mockModel.find as any).mockReturnValue({ populate: populateMock });
		const result = await repository.getAll();
		expect(result).toHaveLength(2);
		// biome-ignore lint/suspicious/noExplicitAny: test assertion requires any for type flexibility
		expect(result.map(r => (r as any).id)).toEqual(['1', '2']);
	});

	it('getByReserverId should filter and convert', async () => {
		const fakeDocs = [
			{ _id: '1', reserver: 'res1', listing: {} },
			{ _id: '2', reserver: 'res1', listing: {} },
		];
		// biome-ignore lint/suspicious/noExplicitAny: test mock requires any for type flexibility
		vi.spyOn(mockConverter, 'toDomain').mockImplementation((doc) => ({ id: (doc as any)._id }) as any);
		const execMock = vi.fn().mockResolvedValue(fakeDocs);
		const populateMock = vi.fn().mockReturnValue({ exec: execMock });
		// biome-ignore lint/suspicious/noExplicitAny: test mock requires any for type flexibility
		(mockModel.find as any).mockReturnValue({ populate: populateMock });
		const result = await repository.getByReserverId('res1');
		expect(result).toHaveLength(2);
	});

	it('getByListingId should filter and convert', async () => {
		const fakeDocs = [
			{ _id: '1', listing: 'list1', reserver: {} },
			{ _id: '2', listing: 'list1', reserver: {} },
		];
		// biome-ignore lint/suspicious/noExplicitAny: test mock requires any for type flexibility
		vi.spyOn(mockConverter, 'toDomain').mockImplementation((doc) => ({ id: (doc as any)._id }) as any);
		const execMock = vi.fn().mockResolvedValue(fakeDocs);
		const populateMock = vi.fn().mockReturnValue({ exec: execMock });
		// biome-ignore lint/suspicious/noExplicitAny: test mock requires any for type flexibility
		(mockModel.find as any).mockReturnValue({ populate: populateMock });
		const result = await repository.getByListingId('list1');
		expect(result).toHaveLength(2);
	});

	it('should have getByReserverId method', () => {
		expect(typeof repository.getByReserverId).toBe('function');
	});

	it('should have getByListingId method', () => {
		expect(typeof repository.getByListingId).toBe('function');
	});
});
