import { MongooseDomainAdapater } from "../mongo-domain-adapter";
import { Account, Contact, Role, AccountPermissions, ListingPermissions, Permissions } from "../../../../infrastructure/data-sources/cosmos-db/models/account";
import { AccountProps } from "../../../contexts/account/account";
import { RoleProps } from "../../../contexts/account/role";
import { ContactProps } from "../../../contexts/account/contact";
import { PermissionsProps } from "../../../contexts/account/permissions";
import { ListingPermissionsProps } from "../../../contexts/account/listing-permissions";
import { AccountPermissionsProps } from "../../../contexts/account/account-permissions";
import { UserDomainAdapter } from "./user-domain-adapter";
import { User, UserEntityReference } from "../../../contexts/user/user";

class AccountPermissionsAdapter implements AccountPermissionsProps  {
  constructor(public readonly props: AccountPermissions) { }
  public get id(): string { return this.props.id.valueOf() as string; }
  public get canManageRolesAndPermissions(): boolean { return this.props.canManageRolesAndPermissions; }
  public set canManageRolesAndPermissions(value: boolean) { this.props.canManageRolesAndPermissions = value; }
}

class ListingPermissionsAdapter implements ListingPermissionsProps {
  constructor(public readonly props: ListingPermissions) { }
  public get id(): string { return this.props.id.valueOf() as string; }
  public get canManageListings(): boolean { return this.props.canManageListings; }
  public set canManageListings(value: boolean) { this.props.canManageListings = value; }
}

class PermissionsAdapter implements PermissionsProps{
  constructor(public readonly props: Permissions) { }
  public get id(): string { return this.props.id.valueOf() as string; }
  public get listingPermissions(): ListingPermissionsProps { return new ListingPermissionsAdapter(this.props.listingPermissions); }
 // public set listingPermissions(value: ListingPermissionsProps) { this.props.listingPermissions = value; }
  public get accountPermissions(): AccountPermissionsProps { return new AccountPermissionsAdapter(this.props.accountPermissions); }
 // public set accountPermissions(value: AccountPermissionsProps) { this.props.accountPermissions = value; }
}

class RoleAdapter implements RoleProps{
  constructor(public readonly props: Role) { }
  public get id(): string { return this.props.id.valueOf() as string; }
  public get roleName(): string { return this.props.roleName; }
  public set roleName(value: string) { this.props.roleName = value; }
  public get isDefault(): boolean { return this.props.isDefault; }
  public set isDefault(value: boolean) { this.props.isDefault = value; }
  public get permissions(): PermissionsProps { return new PermissionsAdapter(this.props.permissions); }
//  public set permissions(value: PermissionsProps) { this.props.permissions = value; }
  public get createdAt(): Date { return this.props.createdAt; }
  public set createdAt(value: Date) { this.props.createdAt = value; }
  public get updatedAt(): Date { return this.props.updatedAt; }
  public set updatedAt(value: Date) { this.props.updatedAt = value; }
}

class ContactDomainAdapter implements ContactProps{
  constructor(public readonly props: Contact) { }
  public get id(): string { return this.props.id.valueOf() as string; }
  public get firstName(): string { return this.props.firstName; }
  public set firstName(value: string) { this.props.firstName = value; }
  public get lastName(): string { return this.props.lastName; }
  public set lastName(value: string) { this.props.lastName = value; }
  public get role(): RoleProps {  return this.props.role ? new RoleAdapter(this.props.role) : undefined; }
  public get user(): UserEntityReference { return this.props.user ? new User(new UserDomainAdapter(this.props.user)) : undefined;}
  public get createdAt(): Date { return this.props.createdAt; }
  public set createdAt(value: Date) { this.props.createdAt = value; }
  public get updatedAt(): Date { return this.props.updatedAt; }
  public set updatedAt(value: Date) { this.props.updatedAt = value; }
}

export class AccountDomainAdapter extends MongooseDomainAdapater<Account> implements AccountProps {
  constructor(props: Account) { super(props); }

  public get name(): string { return this.props.name; }
  public set name(value: string) { this.props.name = value; }

  public get contacts(): ContactProps[] { return this.props.contacts.map(c => new ContactDomainAdapter(c)); }
  public get roles(): RoleProps[] { return this.props.roles.map(r => new RoleAdapter(r)); }
}