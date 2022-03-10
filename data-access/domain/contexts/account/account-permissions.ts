import { Entity, EntityProps } from "../../shared/entity";
import { AccountVisa } from "../iam/account-visa";
import { AccountPermissions as AccountPermissionsSpec } from "./account";

export interface AccountPermissionsProps extends AccountPermissionsSpec, EntityProps {}

export class AccountPermissions extends Entity<AccountPermissionsProps> implements AccountPermissionsEntityReference {
  constructor(props: AccountPermissionsProps,private visa:AccountVisa) {super(props);}

  get canManageRolesAndPermissions(): boolean {return this.props.canManageRolesAndPermissions;}
  get canManageAccountSettings(): boolean {return this.props.canManageAccountSettings;}

  public async setCanManageRolesAndPermissions(value:boolean): Promise<void> {
    if(! await this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions)) {
      throw new Error('Cannot set permission');
    }
    this.props.canManageRolesAndPermissions = value;
  }

  public async setCanManageAccountSettings(value:boolean): Promise<void> {
    if(! await this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions)) {
      throw new Error('Cannot set permission');
    }
    this.props.canManageAccountSettings = value;
  }
}

export interface AccountPermissionsEntityReference extends Readonly<AccountPermissionsProps> {}