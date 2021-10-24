import { Entity, EntityProps } from "../../shared/entity";
import { ListingPermissions as ListingPrermissionsSpec } from "../listing/listing";

export interface ListingPermissionsProps extends ListingPrermissionsSpec, EntityProps {}

export class ListingPermissions extends Entity<ListingPermissionsProps> implements ListingPermissionsEntityReference {
  constructor(props: ListingPermissionsProps) {super(props);}

  get canManageListings(): boolean {return this.props.canManageListings;}
}

export interface ListingPermissionsEntityReference extends Readonly<ListingPermissionsProps> {}