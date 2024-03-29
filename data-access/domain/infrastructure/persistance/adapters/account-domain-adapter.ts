import { MongooseDomainAdapater, MongoosePropArray } from '../mongo-domain-adapter';
import { Account, Contact, AccountPermissions, Role, ListingPermissions, Permissions } from '../../../../infrastructure/data-sources/cosmos-db/models/account';
import { Account as AccountDO, AccountProps } from '../../../contexts/account/account';
import { Role as RoleDO, RoleEntityReference, RoleProps } from '../../../contexts/account/role';
import { Contact as ContactDO, ContactProps } from '../../../contexts/account/contact';
import { PermissionsProps } from '../../../contexts/account/permissions';
import { ListingPermissionsProps } from '../../../contexts/account/listing-permissions';
import { AccountPermissionsProps } from '../../../contexts/account/account-permissions';
import { UserDomainAdapter } from './user-domain-adapter';
import { User, UserEntityReference, UserProps } from '../../../contexts/user/user';
import mongoose, { Mongoose } from 'mongoose';
import { DomainExecutionContext } from '../../../contexts/context'; 

import { MongoTypeConverter } from '../mongo-type-converter';
import { Rule } from 'graphql-shield/dist/rules';
export class AccountConverter extends MongoTypeConverter<DomainExecutionContext,Account,AccountDomainAdapter,AccountDO<AccountDomainAdapter>> {
  constructor() {
    super(AccountDomainAdapter, AccountDO);
  }
}

class AccountPermissionsAdapter implements AccountPermissionsProps  {
  constructor(public readonly props: AccountPermissions) { }
  public get id(): string { return this.props.id.valueOf() as string; }
  public get canManageRolesAndPermissions(): boolean { return this.props.canManageRolesAndPermissions; }
  public set canManageRolesAndPermissions(value: boolean) { this.props.canManageRolesAndPermissions = value; }

  public get canManageAccountSettings(): boolean { return this.props.canManageAccountSettings; }
  public set canManageAccountSettings(value: boolean) { this.props.canManageAccountSettings = value; }
}

class ListingPermissionsAdapter implements ListingPermissionsProps {
  constructor(public readonly props: ListingPermissions) { }
  public get id(): string { return this.props.id.valueOf() as string; }
  public get canManageListings(): boolean { return this.props.canManageListings; }
  public set canManageListings(value: boolean) { this.props.canManageListings = value; }
  public get isSystemAccount(): boolean { return false; }
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
  public get permissions(): PermissionsProps { 
    if(!this.props.permissions){this.props.set('permissions',{});  }
    return new PermissionsAdapter(this.props.permissions); 
  }
  public get createdAt(): Date { return this.props.createdAt; }
  public set createdAt(value: Date) { this.props.createdAt = value; }
  public get updatedAt(): Date { return this.props.updatedAt; }
  public set updatedAt(value: Date) { this.props.updatedAt = value; }
}
const getValueOfId = (idField: mongoose.Schema.Types.ObjectId|undefined):string|undefined => {
  if(idField) {
    return idField.valueOf() as string;
  }
  return undefined;
}

class ContactDomainAdapter implements ContactProps{
  constructor(public readonly props: Contact) { }
  public get id(): string { return this.props.id.valueOf() as string; }
  public get firstName(): string { return this.props.firstName; }
  public set firstName(value: string) { this.props.firstName = value; }
  public get lastName(): string { return this.props.lastName; }
  public set lastName(value: string) { this.props.lastName = value; }
  public get roleId(): string { return getValueOfId(this.props.role); }
  public get role(): RoleProps {  return this.props.role ? new RoleAdapter(this.props.role) : undefined; }
  public addRole(role: RoleEntityReference): void {
    this.props.set('role',role.id);
  }
  public get user(): UserProps { 
    var result: UserProps = undefined;
    if(this.props.user){
      
      result = new UserDomainAdapter(this.props.user);
      console.log('gotUser',result);
    }
    return result;
   // return this.props.user ? (new UserDomainAdapter(this.props.user)) : undefined;
  }
  public addUser<props extends UserProps>(user: User<props>): void {
    this.props.set('user', user.props.id);
  }
  public get createdAt(): Date { return this.props.createdAt; }
  public set createdAt(value: Date) { this.props.createdAt = value; }
  public get updatedAt(): Date { return this.props.updatedAt; }
  public set updatedAt(value: Date) { this.props.updatedAt = value; }
  
}

export class AccountDomainAdapter extends MongooseDomainAdapater<Account> implements AccountProps {
  constructor(props: Account) { super(props); }
  
  public get name(): string { return this.props.name; }
  public set name(value: string) { this.props.name = value; }

  public get handle(): string { return this.props.handle; }
  public set handle(handle: string) { this.props.handle = handle; }

  public async contacts(): Promise<ContactProps[]> { 
    await this.props.populate('contacts.user');
    return this.props.contacts.map(c => new ContactDomainAdapter(c));
  }
  public getNewContact(): ContactProps {
    if(!this.props.contacts) {
      this.props.contacts = new mongoose.Types.DocumentArray<Contact>([]);
    }
    return new ContactDomainAdapter(this.props.contacts.create({_id: new mongoose.Types.ObjectId()}));
  }
  public addContact<props extends ContactProps>(contact: ContactDO<props>): void {
    this.props.contacts.push(contact.props);
  }
  public getNewRole(): RoleProps {
    if(!this.props.roles) {
      this.props.roles = new mongoose.Types.DocumentArray<Role>([]);
    }
    return new RoleAdapter(this.props.roles.create({_id: new mongoose.Types.ObjectId()}));
  }
  public addRole<props extends RoleProps>(roleProps: props): props {
    const index = this.props.roles.push(roleProps);
    return this.props.roles.at(index -1) as any as props;
  }

  public roles = new MongoosePropArray(this.props.roles, RoleAdapter);
}