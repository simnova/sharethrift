import { Entity, EntityProps } from "../../shared/entity";
import { ListingPermissions, ListingPermissionsProps } from "./listing-permissions";
import { AccountPermissions, AccountPermissionsProps } from "./account-permissions";

export interface PermissionsProps extends EntityProps {
  listingPermissions: ListingPermissionsProps;
  accountPermissions: AccountPermissionsProps;
}

export interface PermissionsEntityReference extends Readonly<PermissionsProps> {}

export class Permissions extends Entity<PermissionsProps> implements PermissionsEntityReference {
  get listingPermissions(): ListingPermissions {
    return new ListingPermissions(this.props.listingPermissions);
  }
  get accountPermissions(): AccountPermissions {
    return new AccountPermissions(this.props.accountPermissions);
  }
}