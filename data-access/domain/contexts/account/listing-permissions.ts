import { Entity, EntityProps } from "../../shared/entity";
import { AccountVisa } from "../iam/account-visa";
import { ListingPermissions as ListingPrermissionsSpec } from "../listing/listing";

export interface ListingPermissionsProps extends ListingPrermissionsSpec, EntityProps {}

export interface ListingPermissionsEntityReference extends Readonly<ListingPermissionsProps> {}

export class ListingPermissions extends Entity<ListingPermissionsProps> implements ListingPermissionsEntityReference {
  constructor(props: ListingPermissionsProps,private visa:AccountVisa) {super(props);}

  get canManageListings(): boolean {return this.props.canManageListings;}

  public async setCanManageListings(value:boolean): Promise<void> {
    if(! await this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions)) {
      throw new Error('Cannot set permission');
    }
    this.props.canManageListings = value;
  }

}