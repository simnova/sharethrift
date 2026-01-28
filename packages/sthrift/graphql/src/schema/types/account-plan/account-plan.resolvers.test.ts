import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import { expect, vi } from 'vitest';
import type { GraphContext } from '../../../init/context.ts';
import accountPlanResolvers from './account-plan.resolvers.ts';

// Generic GraphQL resolver type for tests
type TestResolver<
	Args extends object = Record<string, unknown>,
	Return = unknown,
> = (
	parent: unknown,
	args: Args,
	context: GraphContext,
	info: unknown,
) => Promise<Return>;

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/account-plan.resolvers.feature'),
);

// Type for AccountPlan entity reference
type AccountPlanEntity =
	Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference;

// Helper function to create mock account plan
function createMockAccountPlan(
	overrides: Partial<AccountPlanEntity> = {},
): AccountPlanEntity {
	const baseAccountPlan: AccountPlanEntity = {
		id: 'plan-1',
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
		status: 'active',
		cybersourcePlanId: 'cyber-123',
		createdAt: new Date('2020-01-01T00:00:00Z'),
		updatedAt: new Date('2020-01-02T00:00:00Z'),
		schemaVersion: '1.0.0',
		...overrides,
	} as AccountPlanEntity;
	return baseAccountPlan;
}

function makeMockGraphContext(
	overrides: Partial<GraphContext> = {},
): GraphContext {
	return {
		applicationServices: {
			AccountPlan: {
				AccountPlan: {
					queryAll: vi.fn(),
					queryById: vi.fn(),
					create: vi.fn(),
				},
			},
		},
		...overrides,
	} as unknown as GraphContext;
}

test.for(feature, ({ Scenario }) => {
	let context: GraphContext;
	let result: unknown;
	let error: Error | undefined;

	Scenario('Querying all account plans', ({ When, Then }) => {
		When('the accountPlans query is executed', async () => {
			context = makeMockGraphContext();
			(
				context.applicationServices.AccountPlan.AccountPlan
					.queryAll as ReturnType<typeof vi.fn>
			).mockResolvedValue([createMockAccountPlan()]);

			const resolver = accountPlanResolvers.Query
				?.accountPlans as TestResolver;
			if (!resolver) throw new Error('Resolver not found');
			result = await resolver(null, {}, context, null);
		});
		Then('it should return a list of AccountPlan entities', () => {
			expect(Array.isArray(result)).toBe(true);
			expect((result as AccountPlanEntity[]).length).toBeGreaterThan(0);
			// biome-ignore lint/style/noNonNullAssertion: Test assertion after length check
			expect((result as AccountPlanEntity[])[0]!.id).toBe('plan-1');
		});
	});

	Scenario('Querying all account plans returns empty list', ({ When, Then }) => {
		When('the accountPlans query is executed with no plans', async () => {
			context = makeMockGraphContext();
			(
				context.applicationServices.AccountPlan.AccountPlan
					.queryAll as ReturnType<typeof vi.fn>
			).mockResolvedValue([]);

			const resolver = accountPlanResolvers.Query
				?.accountPlans as TestResolver;
			if (!resolver) throw new Error('Resolver not found');
			result = await resolver(null, {}, context, null);
		});
		Then('it should return an empty list', () => {
			expect(Array.isArray(result)).toBe(true);
			expect((result as AccountPlanEntity[]).length).toBe(0);
		});
	});

	Scenario(
		'Querying all account plans when an error occurs',
		({ When, Then }) => {
			When('the accountPlans query throws an error', async () => {
				context = makeMockGraphContext();
				(
					context.applicationServices.AccountPlan.AccountPlan
						.queryAll as ReturnType<typeof vi.fn>
				).mockRejectedValue(new Error('Database error'));

				const resolver = accountPlanResolvers.Query
					?.accountPlans as TestResolver;
				if (!resolver) throw new Error('Resolver not found');
				try {
					result = await resolver(null, {}, context, null);
				} catch (e) {
					error = e as Error;
				}
			});
			Then('it should propagate the error message', () => {
				expect(error).toBeDefined();
				expect(error?.message).toContain('Database error');
			});
		},
	);

	Scenario(
		'Querying an account plan by ID',
		({ Given, When, Then, And }) => {
			Given('a valid account plan ID', () => {
				context = makeMockGraphContext();
				(
					context.applicationServices.AccountPlan.AccountPlan
						.queryById as ReturnType<typeof vi.fn>
				).mockResolvedValue(createMockAccountPlan());
			});
			When('the accountPlan query is executed with that ID', async () => {
				const resolver = accountPlanResolvers.Query
					?.accountPlan as TestResolver<{
					accountPlanId: string;
				}>;
				if (!resolver) throw new Error('Resolver not found');
				result = await resolver(
					null,
					{ accountPlanId: 'plan-1' },
					context,
					null,
				);
			});
			Then(
				'it should call AccountPlan.AccountPlan.queryById with the provided accountPlanId',
				() => {
					expect(
						context.applicationServices.AccountPlan.AccountPlan.queryById,
					).toHaveBeenCalledWith({ accountPlanId: 'plan-1' });
				},
			);
			And('it should return the corresponding AccountPlan entity', () => {
				expect(result).toBeDefined();
				expect((result as AccountPlanEntity).id).toBe('plan-1');
			});
		},
	);

	Scenario(
		'Querying an account plan by ID that does not exist',
		({ Given, When, Then }) => {
			Given('an account plan ID that does not match any record', () => {
				context = makeMockGraphContext();
				(
					context.applicationServices.AccountPlan.AccountPlan
						.queryById as ReturnType<typeof vi.fn>
				).mockResolvedValue(null);
			});
			When('the accountPlan query is executed', async () => {
				const resolver = accountPlanResolvers.Query
					?.accountPlan as TestResolver<{
					accountPlanId: string;
				}>;
				if (!resolver) throw new Error('Resolver not found');
				result = await resolver(
					null,
					{ accountPlanId: 'nonexistent' },
					context,
					null,
				);
			});
			Then('it should return null', () => {
				expect(result).toBeNull();
			});
		},
	);

	Scenario(
		'Querying an account plan by ID when an error occurs',
		({ Given, And, When, Then }) => {
			Given('a valid account plan ID', () => {
				context = makeMockGraphContext();
			});
			And('AccountPlan.AccountPlan.queryById throws an error', () => {
				(
					context.applicationServices.AccountPlan.AccountPlan
						.queryById as ReturnType<typeof vi.fn>
				).mockRejectedValue(new Error('Database error'));
			});
			When('the accountPlan query is executed with error', async () => {
				const resolver = accountPlanResolvers.Query
					?.accountPlan as TestResolver<{
					accountPlanId: string;
				}>;
				if (!resolver) throw new Error('Resolver not found');
				try {
					result = await resolver(
						null,
						{ accountPlanId: 'plan-1' },
						context,
						null,
					);
				} catch (e) {
					error = e as Error;
				}
			});
			Then('it should propagate the error message', () => {
				expect(error).toBeDefined();
				expect(error?.message).toContain('Database error');
			});
		},
	);

	Scenario(
		'Creating an account plan successfully',
		({ Given, When, Then, And }) => {
			const createInput = {
				name: 'Premium Plan',
				description: 'A premium subscription plan',
				billingPeriodLength: 1,
				billingPeriodUnit: 'month',
				billingCycles: 12,
				billingAmount: 19.99,
				currency: 'USD',
				setupFee: 5.0,
				feature: {
					activeReservations: 10,
					bookmarks: 50,
					itemsToShare: 100,
					friends: 200,
				},
			};

			Given('a valid AccountPlanCreateInput', () => {
				context = makeMockGraphContext();
				(
					context.applicationServices.AccountPlan.AccountPlan
						.create as ReturnType<typeof vi.fn>
				).mockResolvedValue(
					createMockAccountPlan({
						id: 'plan-2',
						name: 'Premium Plan',
					}),
				);
			});
			When(
				'the accountPlanCreate mutation is executed with that input',
				async () => {
					const resolver = accountPlanResolvers.Mutation
						?.accountPlanCreate as TestResolver<{
						input: typeof createInput;
					}>;
					if (!resolver) throw new Error('Resolver not found');
					result = await resolver(null, { input: createInput }, context, null);
				},
			);
			Then(
				'it should call AccountPlan.AccountPlan.create with the provided input fields',
				() => {
					expect(
						context.applicationServices.AccountPlan.AccountPlan.create,
					).toHaveBeenCalledWith(createInput);
				},
			);
			And(
				'it should return an AccountPlanMutationResult with success true and the created account plan',
				() => {
					expect(result).toBeDefined();
					expect((result as { status: { success: boolean } }).status.success).toBe(
						true,
					);
					expect(
						(result as { accountPlan: AccountPlanEntity }).accountPlan,
					).toBeDefined();
					expect(
						(result as { accountPlan: AccountPlanEntity }).accountPlan.name,
					).toBe('Premium Plan');
				},
			);
		},
	);

	Scenario(
		'Creating an account plan when create throws an error',
		({ Given, And, When, Then }) => {
			const createInput = {
				name: 'Premium Plan',
				description: 'A premium subscription plan',
				billingPeriodLength: 1,
				billingPeriodUnit: 'month',
				billingCycles: 12,
				billingAmount: 19.99,
				currency: 'USD',
				setupFee: 5.0,
				feature: {
					activeReservations: 10,
					bookmarks: 50,
					itemsToShare: 100,
					friends: 200,
				},
			};

			Given('a valid AccountPlanCreateInput', () => {
				context = makeMockGraphContext();
			});
			And('AccountPlan.AccountPlan.create throws an error', () => {
				(
					context.applicationServices.AccountPlan.AccountPlan
						.create as ReturnType<typeof vi.fn>
				).mockRejectedValue(new Error('Creation failed'));
			});
			When('the accountPlanCreate mutation is executed', async () => {
				const resolver = accountPlanResolvers.Mutation
					?.accountPlanCreate as TestResolver<{
					input: typeof createInput;
				}>;
				if (!resolver) throw new Error('Resolver not found');
				result = await resolver(null, { input: createInput }, context, null);
			});
			Then(
				'it should return an AccountPlanMutationResult with success false and the error message',
				() => {
					expect(result).toBeDefined();
					expect((result as { status: { success: boolean } }).status.success).toBe(
						false,
					);
					expect(
						(result as { status: { errorMessage?: string } }).status.errorMessage,
					).toContain('Creation failed');
				},
			);
		},
	);
});
