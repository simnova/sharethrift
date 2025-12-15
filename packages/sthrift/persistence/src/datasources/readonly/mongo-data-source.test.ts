import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { FilterQuery, Model } from 'mongoose';
import { describe, expect, it, vi } from 'vitest';
import { MongoDataSourceImpl } from './mongo-data-source.ts';

type TestDoc = MongooseSeedwork.Base & {
	name: string;
	nested?: { _id: string; value: string };
};

interface ThenableMock<T> {
	catch: (reject: (error: unknown) => unknown) => Promise<T>;
	finally: (onFinally: () => void) => Promise<T>;
}

function createThenableMock<T>(value: T): ThenableMock<T> {
	const mock: ThenableMock<T> = {
		catch: (reject: (error: unknown) => unknown) => Promise.resolve(value).catch(reject),
		finally: (onFinally: () => void) => Promise.resolve(value).finally(onFinally),
	};
	Object.defineProperty(mock, 'then', {
		value: (resolve: (value: T) => unknown) => Promise.resolve(value).then(resolve),
		enumerable: false,
		configurable: true,
	});
	return mock;
}

describe('MongoDataSourceImpl - Additional Coverage', () => {
	describe('buildProjection', () => {
		it('should handle empty fields array', async () => {
			const mockModel = {
				find: vi.fn().mockReturnValue({
					lean: vi.fn().mockReturnValue(createThenableMock([])),
				}),
			} as unknown as Model<TestDoc>;
			const dataSource = new MongoDataSourceImpl(mockModel);

			await dataSource.find({}, { fields: [] });
			expect(mockModel.find).toHaveBeenCalled();
		});

		it('should handle exclude projection mode', async () => {
			const mockModel = {
				find: vi.fn().mockReturnValue({
					lean: vi.fn().mockReturnValue(createThenableMock([])),
				}),
			} as unknown as Model<TestDoc>;
			const dataSource = new MongoDataSourceImpl(mockModel);

			await dataSource.find({}, { fields: ['name'], projectionMode: 'exclude' });
			expect(mockModel.find).toHaveBeenCalled();
		});
	});

	describe('buildFilterQuery', () => {
		it('should remove null values from filter', async () => {
			const mockModel = {
				find: vi.fn().mockReturnValue({
					lean: vi.fn().mockReturnValue(createThenableMock([])),
				}),
			} as unknown as Model<TestDoc>;
			const dataSource = new MongoDataSourceImpl(mockModel);

			await dataSource.find({ name: null } as never);
			// The null value should be filtered out
			expect(mockModel.find).toHaveBeenCalledWith({}, {}, {});
		});

		it('should remove undefined values from filter', async () => {
			const mockModel = {
				find: vi.fn().mockReturnValue({
					lean: vi.fn().mockReturnValue(createThenableMock([])),
				}),
			} as unknown as Model<TestDoc>;
			const dataSource = new MongoDataSourceImpl(mockModel);

			await dataSource.find({ name: undefined } as FilterQuery<TestDoc>);
			// The undefined value should be filtered out
			expect(mockModel.find).toHaveBeenCalledWith({}, {}, {});
		});
	});

	describe('appendId', () => {
		it('should append id to nested subdocuments with _id', async () => {
			const mockDoc = {
				_id: new MongooseSeedwork.ObjectId(),
				name: 'test',
				nested: {
					_id: new MongooseSeedwork.ObjectId(),
					value: 'nested value',
				},
			};

			const mockModel = {
				find: vi.fn().mockReturnValue({
					lean: vi.fn().mockReturnValue(createThenableMock([mockDoc])),
				}),
			} as unknown as Model<TestDoc>;
			const dataSource = new MongoDataSourceImpl(mockModel);

			const result = await dataSource.find({});
			expect(result[0].id).toBeDefined();
		expect(result[0].nested).toBeDefined();
		expect((result[0].nested as unknown as { id: string }).id).toBeDefined();
		});

		it('should not append id to nested objects without _id', async () => {
			const mockDoc = {
				_id: new MongooseSeedwork.ObjectId(),
				name: 'test',
				nested: {
					value: 'nested value',
				},
			};

			const mockModel = {
				find: vi.fn().mockReturnValue({
					lean: vi.fn().mockReturnValue(createThenableMock([mockDoc])),
				}),
			} as unknown as Model<TestDoc>;
			const dataSource = new MongoDataSourceImpl(mockModel);

			const result = await dataSource.find({});
			expect(result[0].id).toBeDefined();
			expect((result[0].nested as { id?: string })?.id).toBeUndefined();
		});
	});

	describe('buildQueryOptions', () => {
		it('should include limit when provided', async () => {
			const mockModel = {
				find: vi.fn().mockReturnValue({
					lean: vi.fn().mockReturnValue(createThenableMock([])),
				}),
			} as unknown as Model<TestDoc>;
			const dataSource = new MongoDataSourceImpl(mockModel);

			await dataSource.find({}, { limit: 10 });
			expect(mockModel.find).toHaveBeenCalledWith({}, {}, { limit: 10 });
		});

		it('should include skip when provided', async () => {
			const mockModel = {
				find: vi.fn().mockReturnValue({
					lean: vi.fn().mockReturnValue(createThenableMock([])),
				}),
			} as unknown as Model<TestDoc>;
			const dataSource = new MongoDataSourceImpl(mockModel);

			await dataSource.find({}, { skip: 5 });
			expect(mockModel.find).toHaveBeenCalledWith({}, {}, { skip: 5 });
		});

		it('should include sort when provided', async () => {
			const mockModel = {
				find: vi.fn().mockReturnValue({
					lean: vi.fn().mockReturnValue(createThenableMock([])),
				}),
			} as unknown as Model<TestDoc>;
			const dataSource = new MongoDataSourceImpl(mockModel);

			await dataSource.find({}, { sort: { name: 1 } });
			expect(mockModel.find).toHaveBeenCalledWith({}, {}, { sort: { name: 1 } });
		});
	});
});
