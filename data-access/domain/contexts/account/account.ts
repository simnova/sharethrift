import { AccountCreatedEvent } from '../../events/account-created';
import { AggregateRoot } from '../../shared/aggregate-root';
import { EntityProps } from '../../shared/entity';
import { PropArray } from '../../shared/prop-array';
import { Passport } from '../iam/passport';
import { User, UserProps } from '../user/user';
import { Contact, ContactEntityReference, ContactProps } from './contact';
import { RoleProps, RoleEntityReference, Role } from './role';
import * as ValueObjects from './account-value-objects';
import { AccountVisa } from '../iam/account-visa';
import { DomainExecutionContext } from '../context';

export interface AccountPropValues extends EntityProps {
  name: string;
  handle: string;
  createdAt: Date;
  updatedAt: Date;
  schemaVersion: string;
}
export interface AccountProps extends AccountPropValues, EntityProps {
  contacts(): Promise<ReadonlyArray<ContactProps>>;
  getNewContact(): ContactProps;
  getNewRole(): RoleProps;
  addContact<props extends ContactProps>(contact: Contact<props>):void;
  addRole<props extends RoleProps>(role: props):props;

  roles: PropArray<RoleProps>;
}

export interface AccountEntityReference extends Readonly<AccountPropValues> {
  readonly contacts: () => Promise<ContactEntityReference[]>;
  readonly roles: RoleEntityReference[];
}

const adminRoleName = "Administrator";

export class Account<props extends AccountProps> extends AggregateRoot<props> implements AccountEntityReference  {
  constructor(props: props,private context:DomainExecutionContext) { 
    super(props); 
    this.visa = context.passport.forAcccount(this);
  }
  protected visa: AccountVisa;


  get name(): string {return this.props.name;}
  get handle(): string {return this.props.handle;}
  set handle(value: string) {this.props.handle = value;}
  get updatedAt(): Date {return this.props.updatedAt;}
  get createdAt(): Date {return this.props.createdAt;}
  get schemaVersion(): string {return this.props.schemaVersion;}
  public async contacts(): Promise<ContactEntityReference[]>  { 
    return (await this.props.contacts()).map(contact => new Contact(contact,this.visa,this.context));
  }
  get roles(): Role<any>[] { return this.props.roles.items.map(role => new Role(role,this.visa)); }

  static async CreateInitialAccountForNewUser<newPropType extends AccountProps, userProps extends UserProps>(props:newPropType,newUser:User<userProps>,context:DomainExecutionContext): Promise<Account<newPropType>> {
    props.name = newUser.id;
    props.handle = newUser.id;
    let account = new Account(props,context);
    account.visa = {determineIf: async (func: (permissions:AccountPermissions) => boolean) => true};
    account.addDefaultRoles();
    account.addContact(newUser);
    console.log('after-adding-contact', JSON.stringify(account));
    await account.assignRoleToContact(account.props.roles.items.find(x => x.roleName === adminRoleName), (await account.props.contacts())[0]);
    console.log('after-assigning-role', JSON.stringify(account));
    account.markAsNew();
    account.addIntegrationEvent(AccountCreatedEvent,{accountId: account.id, userId: newUser.id});

    return account;
  }

  public async setHandle(handle: ValueObjects.Handle): Promise<void>{
    if(!await this.visa.determineIf((permissions) => permissions.canManageAccountSettings)) {
      throw new Error('Cannot set handle. Permission denied');
    }
    this.props.handle = handle.valueOf();
    //todo verify handle is unique
  }

  public async setName(name: ValueObjects.Name): Promise<void>{
    if(!await this.visa.determineIf((permissions) => permissions.canManageAccountSettings)) {
      throw new Error('Cannot set name. Permission denied');
    }
    this.props.name = name.valueOf();
  }

  public async requestAddRole(roleName:string): Promise<Role<any>> {
    if(!(await this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions))) {
      throw new Error('Cannot add role. Permission denied');
    }
    if(this.props.roles.items.some(x => x.roleName === roleName)) {
      throw new Error('Role already exists');
    }

    const baseRule = this.props.roles.getNewItem();
    const ruleDefaults = {
      roleName: roleName,
      isDefault: false
    } as Partial<RoleProps>;
    
    const mergedRule = {...baseRule, ...ruleDefaults};
    const addedRule = this.props.addRole(mergedRule);
    return  new Role(addedRule,this.visa);
  }

  private async addContact<userProps extends UserProps>(newUser:User<userProps>): Promise<void> {
    this.props.addContact(new Contact(this.props.getNewContact(),this.visa,this.context));
    let contactProps = (await this.props.contacts())[0];
    contactProps.firstName = newUser.firstName;
    contactProps.lastName = newUser.lastName;
    contactProps.addUser(newUser);
    console.log('add-contact', contactProps);
  }

  private async assignRoleToContact(role: RoleProps, contact: ContactProps): Promise<void> {
    let verifiedRole = this.props.roles.items.find(x => x.id === role.id);
    if(!verifiedRole) {
      console.log('role-not-found', this.props.roles, role);
      throw new Error('Role does not exist');
    }
    let verifiedAccountContact = (await this.props.contacts()).find(x => x.id === contact.id);
    if(!verifiedAccountContact) {
      console.log('contact-not-found', this.props.contacts, contact);
      throw new Error('Contact does not exist');
    }
    if(verifiedAccountContact.roleId && verifiedAccountContact.roleId === role.id) {
      throw new Error('Contact already has role');
    }
    verifiedAccountContact.addRole(new Role(verifiedRole,this.visa));
  }

  private addDefaultRoles(): void {
    let roleProps =this.props.roles.getNewItem();
    console.log('add-default-roles');
    let newRoleProps ={
      roleName: adminRoleName,
      isDefault: true,
      permissions: {
        accountPermissions: {
          canManageRolesAndPermissions:true,
          canManageAccountSettings:true
        } ,
        listingPermissions: {
          canManageListings: true
        } 
      }
    } as Partial<RoleProps>;
    let meredProps = {...roleProps, ...newRoleProps};
    let role = new Role(meredProps,this.visa);
    this.props.roles.addItem(role);
    console.log('add-default-roles-done2', this.props.roles.items);
  }

  private markAsNew(): void {
    //create integraiton event 
  }

  async deleteRoleAndReassignTo(roleToDelete: RoleEntityReference, roleToAssignTo: RoleEntityReference): Promise<void> {
    if(!(await this.visa.determineIf((permissions) => permissions.canManageRolesAndPermissions))) {
      throw new Error('Cannot delete role');
    }
    if(!this.props.roles.items.includes(roleToDelete)) {
      throw new Error('Role to delete does not exist');
    }
    if(!this.props.roles.items.includes(roleToAssignTo)) {
      throw new Error('Role to assign to does not exist');
    }
    if(roleToDelete.isDefault) {
      throw new Error('Cannot delete default role');
    }
    (await this.props.contacts()).forEach(contact => {
      if(contact.roleId === roleToDelete.id) {
        contact.addRole(roleToAssignTo);
      }
    });
    this.props.roles.removeItem(roleToDelete);
  }
  
}

export interface AccountPermissions {
  canManageRolesAndPermissions: boolean;
  canManageAccountSettings: boolean;
} 