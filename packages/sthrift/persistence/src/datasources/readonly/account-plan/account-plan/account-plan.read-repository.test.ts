import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import type { FindOptions, FindOneOptions } from '../../mongo-data-source.ts';
import { AccountPlanReadRepositoryImpl, getAccountPlanReadRepository } from './account-plan.read-repository.ts';

// Mock the converter
vi.mock('../../../domain/account-plan/account-plan/account-plan.domain-adapter.ts', () => {
	// biome-ignore lint/complexity/useArrowFunction: constructor must use function syntax for 'new' compatibility
	const AccountPlanConverter = vi.fn(function () {
		return {
			toDomain: vi.fn((doc) => ({ id: doc._id, name: doc.name })),
		};
	});

	return { AccountPlanConverter };
});

vi.mock('../account-plan/account-plan.data.ts', () => {
	// biome-ignore lint/complexity/useArrowFunction: constructor must use function syntax for 'new' compatibility
	const AccountPlanDataSourceImpl = vi.fn(function () {
		return {
			find: vi.fn(),
			findById: vi.fn(),
			findOne: vi.fn(),
		};
	});

	return { AccountPlanDataSourceImpl };
});

function makeModelsContext(): ModelsContext {
	// Only AccountPlan.AccountPlanModel is used by AccountPlanReadRepositoryImpl
	const partialContext = {
		AccountPlan: {
			AccountPlanModel: {},
		},
	};

	// Other members are irrelevant for these tests and safely stubbed via cast
	return partialContext as unknown as ModelsContext;
}

function makePassport(): Domain.Passport {
	return {
		forMember: vi.fn().mockReturnThis(),
		determineIf: vi.fn().mockReturnValue({
			isCurrentUser: false,
			canManageMembers: false,
			canManageRolesAndPermissions: false,
			canManageProperties: false,
			canManageViolationTicketsAndServiceTickets: false,
			canManageStaffUsersAndVendors: false,
			canManageSiteContent: false,
			isSystemAccount: false,
		}),
	} as unknown as Domain.Passport;
}

/**
 * Typed helper to access the private mongoDataSource property for testing.
 * Avoids repeated inline casts throughout test assertions.
 */
function getMongoDataSource(repository: AccountPlanReadRepositoryImpl): {
	find: ReturnType<typeof vi.fn>;
	findById: ReturnType<typeof vi.fn>;
	findOne: ReturnType<typeof vi.fn>;
} {
	return (repository as unknown as { mongoDataSource: { 
		find: ReturnType<typeof vi.fn>;
		findById: ReturnType<typeof vi.fn>;
		findOne: ReturnType<typeof vi.fn>;
	} }).mongoDataSource;
}

describe('AccountPlanReadRepositoryImpl', () => {
	let models: ModelsContext;
	let passport: Domain.Passport;

	beforeEach(() => {
		vi.clearAllMocks();
		models = makeModelsContext();
		passport = makePassport();
	});

	describe('constructor', () => {
		it('should create an instance', () => {
			const repository = new AccountPlanReadRepositoryImpl(models, passport);
			expect(repository).toBeDefined();
		});
	});

	describe('getAll', () => {
		it('should return all account plans', async () => {
			const repository = new AccountPlanReadRepositoryImpl(models, passport);
			const mockData = [
				{ _id: '1', name: 'Plan 1' },
				{ _id: '2', name: 'Plan 2' },
			];

			const mongoDataSource = getMongoDataSource(repository);
			mongoDataSource.find = vi.fn().mockResolvedValue(mockData);

			const result = await repository.getAll();
			expect(result).toHaveLength(2);
		});

		it('should call find with options', async () => {
			const repository = new AccountPlanReadRepositoryImpl(models, passport);
			const options: FindOptions = { fields: ['name'] };
			const mockData = [{ _id: '1', name: 'Plan 1' }];

			const mongoDataSource = getMongoDataSource(repository);
			mongoDataSource.find = vi.fn().mockResolvedValue(mockData);

			await repository.getAll(options);
			expect(mongoDataSource.find).toHaveBeenCalledWith({}, options);
		});

		it('should return empty array when no plans exist', async () => {
			const repository = new AccountPlanReadRepositoryImpl(models, passport);

			const mongoDataSource = getMongoDataSource(repository);
			mongoDataSource.find = vi.fn().mockResolvedValue([]);

			const result = await repository.getAll();
			expect(result).toEqual([]);
		});
	});

	describe('getById', () => {
		it('should return account plan by id', async () => {
			const repository = new AccountPlanReadRepositoryImpl(models, passport);
			const mockData = { _id: '123', name: 'Test Plan' };

			const mongoDataSource = getMongoDataSource(repository);
			mongoDataSource.findById = vi.fn().mockResolvedValue(mockData);

			const result = await repository.getById('123');
			expect(result).toBeDefined();
		});

		it('should return null when plan not found', async () => {
			const repository = new AccountPlanReadRepositoryImpl(models, passport);

			const mongoDataSource = getMongoDataSource(repository);
			mongoDataSource.findById = vi.fn().mockResolvedValue(null);

			const result = await repository.getById('nonexistent');
			expect(result).toBeNull();
		});

		it('should call findById with options', async () => {
			const repository = new AccountPlanReadRepositoryImpl(models, passport);
			const options: FindOneOptions = { fields: ['name'] };

			const mongoDataSource = getMongoDataSource(repository);
			mongoDataSource.findById = vi.fn().mockResolvedValue(null);

			await repository.getById('123', options);
			expect(mongoDataSource.findById).toHaveBeenCalledWith('123', options);
		});
	});

	describe('getByName', () => {
		it('should return account plan by name', async () => {
			const repository = new AccountPlanReadRepositoryImpl(models, passport);
			const mockData = { _id: '123', name: 'Premium Plan' };

			const mongoDataSource = getMongoDataSource(repository);
			mongoDataSource.findOne = vi.fn().mockResolvedValue(mockData);

			const result = await repository.getByName('Premium Plan');
			expect(result).toBeDefined();
		});

		it('should return null when plan not found by name', async () => {
			const repository = new AccountPlanReadRepositoryImpl(models, passport);

			const mongoDataSource = getMongoDataSource(repository);
			mongoDataSource.findOne = vi.fn().mockResolvedValue(null);

			const result = await repository.getByName('Nonexistent Plan');
			expect(result).toBeNull();
		});

		it('should call findOne with name filter', async () => {
			const repository = new AccountPlanReadRepositoryImpl(models, passport);

			const mongoDataSource = getMongoDataSource(repository);
			mongoDataSource.findOne = vi.fn().mockResolvedValue(null);

			await repository.getByName('Test Plan');
			expect(mongoDataSource.findOne).toHaveBeenCalledWith({ name: 'Test Plan' });
		});
	});
});

describe('getAccountPlanReadRepository', () => {
	it('should return an AccountPlanReadRepositoryImpl instance', () => {
		const models = makeModelsContext();
		const passport = makePassport();
		const repository = getAccountPlanReadRepository(models, passport);
		expect(repository).toBeInstanceOf(AccountPlanReadRepositoryImpl);
	});
});
