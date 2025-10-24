import type { AccountPlanDomainPermissions } from './../../account-plan/account-plan.domain-permissions.ts';
import { DomainSeedwork } from '@cellix/domain-seedwork';

export interface PersonalUserRoleAccountPlanPermissionsProps
	extends AccountPlanDomainPermissions,
		DomainSeedwork.ValueObjectProps {}

export interface PersonalUserRoleAccountPlanPermissionsEntityReference
	extends Readonly<PersonalUserRoleAccountPlanPermissionsProps> {}

export class PersonalUserRoleAccountPlanPermissions
	extends DomainSeedwork.ValueObject<PersonalUserRoleAccountPlanPermissionsProps>
	implements PersonalUserRoleAccountPlanPermissionsEntityReference
{
	get canCreateAccountPlan(): boolean {
		return this.props.canCreateAccountPlan;
	}

	get canUpdateAccountPlan(): boolean {
		return this.props.canUpdateAccountPlan;
	}
	get canDeleteAccountPlan(): boolean {
		return this.props.canDeleteAccountPlan;
	}
}
