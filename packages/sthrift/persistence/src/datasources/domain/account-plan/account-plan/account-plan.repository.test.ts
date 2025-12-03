import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DomainSeedwork } from '@cellix/domain-seedwork';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { Domain } from '@sthrift/domain';
import type mongoose from 'mongoose';
import { expect, vi } from 'vitest';
import { AccountPlanConverter } from './account-plan.domain-adapter.ts';
import { AccountPlanRepository } from './account-plan.repository.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/account-plan.repository.feature'),
);

// Test utilities
function createValidObjectId(id: string): string {
	const hexChars = '0123456789abcdef';
	let hex = '';
	for (let i = 0; i < id.length && hex.length < 24; i++) {
		const codePoint = id.codePointAt(i) ?? 0;
		hex += hexChars[codePoint % 16];
	}
	return hex.padEnd(24, '0').substring(0, 24);
}

function makePassport(): Domain.Passport {
	return vi.mocked({
		accountPlan: {
			forAccountPlan: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
	} as unknown as Domain.Passport);
}

function makeEventBus(): DomainSeedwork.EventBus {
	return vi.mocked({
		dispatch: vi.fn(),
		register: vi.fn(),
	} as DomainSeedwork.EventBus);
}

function makeAccountPlanDoc(
	id = 'plan-1',
	name = 'Basic Plan',
): Models.AccountPlan.AccountPlan {
	return {
		_id: new MongooseSeedwork.ObjectId(createValidObjectId(id)),
		id: id,
		name: name,
		description: 'A test plan',
		billingPeriodLength: 1,
		billingPeriodUnit: 'month',
		billingCycles: 12,
		billingAmount: 9.99,
		currency: 'USD',
		setupFee: 0,
		feature: {
			activeReservations: 5,
			bookmarks: 10,
			itemsToShare: 20,
			friends: 50,
		},
		status: 'active',
		cybersourcePlanId: 'cyber-123',
		createdAt: new Date(),
		updatedAt: new Date(),
		schemaVersion: '1.0.0',
		set: vi.fn(),
	} as unknown as Models.AccountPlan.AccountPlan;
}

function createChainableQuery<T>(result: T) {
	const query = {
		exec: vi.fn().mockResolvedValue(result),
	};
	return query;
}

function setupAccountPlanRepo(
	mockDocs: Models.AccountPlan.AccountPlan | Models.AccountPlan.AccountPlan[] | null,
	overrides?: {
		findOne?: () => unknown;
		find?: () => unknown;
		modelCtor?: Models.AccountPlan.AccountPlanModelType;
	},
): AccountPlanRepository<Domain.Contexts.AccountPlan.AccountPlan.AccountPlanProps> {
	const isSingleDoc = !Array.isArray(mockDocs);
	const modelType = overrides?.modelCtor ??
		({
			findOne:
				overrides?.findOne ?? (() => createChainableQuery(isSingleDoc ? mockDocs : null)),
			find: overrides?.find ?? (() => createChainableQuery(Array.isArray(mockDocs) ? mockDocs : [])),
		} as unknown as Models.AccountPlan.AccountPlanModelType);

	return new AccountPlanRepository(
		makePassport(),
		modelType,
		new AccountPlanConverter(),
		makeEventBus(),
		vi.mocked({} as mongoose.ClientSession),
	);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let repository: AccountPlanRepository<Domain.Contexts.AccountPlan.AccountPlan.AccountPlanProps>;
	let mockDoc: Models.AccountPlan.AccountPlan;
	let result: unknown;
	let planInfo: {
		name: string;
		description: string;
		billingPeriodLength: number;
		billingPeriodUnit: string;
		billingCycles: number;
		billingAmount: number;
		currency: string;
		setupFee: number;
		feature: {
			activeReservations: number;
			bookmarks: number;
			itemsToShare: number;
			friends: number;
		};
	};

	BeforeEachScenario(() => {
		mockDoc = makeAccountPlanDoc('plan-1');
		repository = setupAccountPlanRepo(mockDoc);
		result = undefined;
	});

	Background(({ Given, And }) => {
		Given(
			'an AccountPlanRepository instance with a working Mongoose model, type converter, and passport',
			() => {
				// Already set up in BeforeEachScenario
			},
		);
		And('valid AccountPlan documents exist in the database', () => {
			// Mock documents are set up in BeforeEachScenario
		});
	});

	Scenario('Getting an account plan by ID', ({ Given, When, Then, And }) => {
		Given('an AccountPlan document with id "plan-1"', () => {
			// Already set up in BeforeEachScenario
		});
		When('I call getById with "plan-1"', async () => {
			result = await repository.getById('plan-1');
		});
		Then('I should receive an AccountPlan domain object', () => {
			expect(result).toBeInstanceOf(
				Domain.Contexts.AccountPlan.AccountPlan.AccountPlan,
			);
		});
		And('the domain object\'s id should be "plan-1"', () => {
			const plan =
				result as Domain.Contexts.AccountPlan.AccountPlan.AccountPlan<Domain.Contexts.AccountPlan.AccountPlan.AccountPlanProps>;
			expect(plan.id).toBe('plan-1');
		});
	});

	Scenario('Getting an account plan by nonexistent ID', ({ When, Then }) => {
		When('I call getById with "nonexistent-id"', async () => {
			repository = setupAccountPlanRepo(null, {
				findOne: () => createChainableQuery(null),
			});

			try {
				result = await repository.getById('nonexistent-id');
			} catch (error) {
				result = error;
			}
		});
		Then(
			'an error should be thrown indicating "AccountPlan with id nonexistent-id not found"',
			() => {
				expect(result).toBeInstanceOf(Error);
				expect((result as Error).message).toContain(
					'AccountPlan with id nonexistent-id not found',
				);
			},
		);
	});

	Scenario('Getting all account plans', ({ Given, When, Then, And }) => {
		Given('multiple AccountPlan documents exist', () => {
			const docs = [
				makeAccountPlanDoc('plan-1', 'Basic Plan'),
				makeAccountPlanDoc('plan-2', 'Premium Plan'),
			];
			repository = setupAccountPlanRepo(docs);
		});
		When('I call getAll', async () => {
			result = await repository.getAll();
		});
		Then('I should receive an array of AccountPlan domain objects', () => {
			expect(Array.isArray(result)).toBe(true);
			expect((result as unknown[]).length).toBe(2);
		});
		And('the array should contain the expected plans', () => {
			const plans =
				result as Domain.Contexts.AccountPlan.AccountPlan.AccountPlan<Domain.Contexts.AccountPlan.AccountPlan.AccountPlanProps>[];
			expect(plans[0]).toBeInstanceOf(
				Domain.Contexts.AccountPlan.AccountPlan.AccountPlan,
			);
			expect(plans[1]).toBeInstanceOf(
				Domain.Contexts.AccountPlan.AccountPlan.AccountPlan,
			);
		});
	});

	Scenario('Getting all account plans when none exist', ({ When, Then }) => {
		When('I call getAll with no documents', async () => {
			repository = setupAccountPlanRepo([]);
			result = await repository.getAll();
		});
		Then('I should receive an empty array', () => {
			expect(Array.isArray(result)).toBe(true);
			expect((result as unknown[]).length).toBe(0);
		});
	});

	Scenario(
		'Creating a new account plan instance',
		({ Given, And, When, Then }) => {
			Given('plan info with name "Basic Plan"', () => {
				planInfo = {
					name: 'Basic Plan',
					description: 'A basic subscription plan',
					billingPeriodLength: 1,
					billingPeriodUnit: 'month',
					billingCycles: 12,
					billingAmount: 9.99,
					currency: 'USD',
					setupFee: 0,
					feature: {
						activeReservations: 5,
						bookmarks: 10,
						itemsToShare: 20,
						friends: 50,
					},
				};
			});
			And('billing period of 1 month', () => {
				// Already set up in previous step
			});
			And('billing amount of 9.99', () => {
				// Already set up in previous step
			});
			When('I call getNewInstance with the plan info', async () => {
				const mockNewDoc = {
					id: { toString: () => 'new-plan-id' },
					name: '',
					description: '',
					billingPeriodLength: 0,
					billingPeriodUnit: '',
					billingCycles: 0,
					billingAmount: 0,
					currency: '',
					setupFee: 0,
					feature: {
						activeReservations: 0,
						bookmarks: 0,
						itemsToShare: 0,
						friends: 0,
					},
					status: '',
					cybersourcePlanId: '',
					createdAt: new Date(),
					updatedAt: new Date(),
					schemaVersion: '1.0.0',
					set: vi.fn(),
				};

				repository = setupAccountPlanRepo(mockDoc, {
					modelCtor: vi.fn(
						() => mockNewDoc,
					) as unknown as Models.AccountPlan.AccountPlanModelType,
				});

				result = await repository.getNewInstance(planInfo);
			});
			Then('I should receive a new AccountPlan domain object', () => {
				expect(result).toBeInstanceOf(
					Domain.Contexts.AccountPlan.AccountPlan.AccountPlan,
				);
			});
			And('the domain object should have the correct name', () => {
				const plan =
					result as Domain.Contexts.AccountPlan.AccountPlan.AccountPlan<Domain.Contexts.AccountPlan.AccountPlan.AccountPlanProps>;
				expect(plan.name).toBe('Basic Plan');
			});
			And('the domain object should have the correct billing info', () => {
				const plan =
					result as Domain.Contexts.AccountPlan.AccountPlan.AccountPlan<Domain.Contexts.AccountPlan.AccountPlan.AccountPlanProps>;
				expect(plan.billingPeriodLength).toBe(1);
				expect(plan.billingPeriodUnit).toBe('month');
				expect(plan.billingAmount).toBe(9.99);
			});
		},
	);
});
