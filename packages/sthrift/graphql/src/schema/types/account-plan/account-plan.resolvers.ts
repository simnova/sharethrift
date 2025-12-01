import type { Resolvers } from '../../builder/generated.ts';
import type { Domain } from '@sthrift/domain';

const AccountPlanMutationResolver = async (
	getAccountPlan: Promise<Domain.Contexts.AccountPlan.AccountPlan.AccountPlanEntityReference>,
) => {
	try {
		return {
			status: { success: true },
			accountPlan: await getAccountPlan,
		};
	} catch (error) {
		console.error('AccountPlan > Mutation  : ', error);
		const { message } = error as Error;
		return {
			status: { success: false, errorMessage: message },
		};
	}
};

const accountPlan: Resolvers = {
	Query: {
		accountPlans: async (_parent, _args, context) => {
			return await context.applicationServices.AccountPlan.AccountPlan.queryAll(
				{},
			);
		},
		accountPlan: async (_parent, _args, context) => {
			return await context.applicationServices.AccountPlan.AccountPlan.queryById(
				{ accountPlanId: _args.accountPlanId },
			);
		},
	},

	Mutation: {
		accountPlanCreate: async (_parent, _args, context) => {
			return await AccountPlanMutationResolver(
				context.applicationServices.AccountPlan.AccountPlan.create({
					..._args.input,
				}),
			);
		},
	},
};

export default accountPlan;
