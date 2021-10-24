import { Entity, EntityProps } from "../../shared/entity";
import { AccountPermissions as AccountPermissionsSpec } from "./account";

export interface AccountPermissionsProps extends AccountPermissionsSpec, EntityProps {}

export class AccountPermissions extends Entity<AccountPermissionsProps> implements AccountPermissionsEntityReference {
  constructor(props: AccountPermissionsProps) {super(props);}

  get canManageRolesAndPermissions(): boolean {return this.props.canManageRolesAndPermissions;}
}

export interface AccountPermissionsEntityReference extends Readonly<AccountPermissionsProps> {}