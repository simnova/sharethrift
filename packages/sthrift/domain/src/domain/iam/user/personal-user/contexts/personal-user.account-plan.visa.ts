import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/personal-user.entity.ts';
import type { AccountPlanDomainPermissions } from '../../../../contexts/account-plan/account-plan.domain-permissions.ts';
import type { AccountPlanVisa } from '../../../../contexts/account-plan/account-plan.visa.ts';
import type { AccountPlanEntityReference } from '../../../../contexts/account-plan/account-plan/account-plan.entity.ts';

export class PersonalUserAccountPlanVisa<
	root extends AccountPlanEntityReference,
> implements AccountPlanVisa
{
	private readonly root: root;
	private readonly user: PersonalUserEntityReference;
	constructor(root: root, user: PersonalUserEntityReference) {
		this.root = root;
		this.user = user;
	}

	determineIf(
		func: (permissions: Readonly<AccountPlanDomainPermissions>) => boolean,
	): boolean {
		// const { accountPlanPermissions } = this.user.role.permissions;
		console.log(this.user);

		const updatedPermissions: AccountPlanDomainPermissions = {
			// canCreateAccountPlan: accountPlanPermissions.canCreateAccountPlan,
			// canUpdateAccountPlan: accountPlanPermissions.canUpdateAccountPlan,
			// canDeleteAccountPlan: accountPlanPermissions.canDeleteAccountPlan,

			canCreateAccountPlan: false,
			canUpdateAccountPlan: false,
			canDeleteAccountPlan: false,
		};

		return func(updatedPermissions);
	}
}
