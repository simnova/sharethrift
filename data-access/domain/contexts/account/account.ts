import { AggregateRoot } from '../../shared/aggregate-root';
import { EntityProps } from '../../shared/entity';
import { Passport } from '../iam/passport';
import { User, UserProps } from '../user/user';
import { Contact, ContactEntityReference, ContactProps } from './contact';
import { RoleProps, RoleEntityReference, Role } from './role';

export interface AccountProps extends EntityProps {
  name: string;
  contacts(): Promise<ContactProps[]>;
  getNewContact(): ContactProps;
  addContact<props extends ContactProps>(contact: Contact<props>):void;
  roles: RoleProps[];
  getNewRole(): RoleProps;
  addRole<props extends RoleProps>(role: Role<props>):void

  createdAt: Date;
  updatedAt: Date;
  schemaVersion: string;
}

const adminRoleName = "Administrator";

export class Account<props extends AccountProps> extends AggregateRoot<props> implements AccountEntityReference  {
  constructor(props: props) { super(props); }

  get name(): string {return this.props.name;}
  get updatedAt(): Date {return this.props.updatedAt;}
  get createdAt(): Date {return this.props.createdAt;}
  get schemaVersion(): string {return this.props.schemaVersion;}
  public async contacts(): Promise<ContactEntityReference[]>  {return (await this.props.contacts()).map(contact => new Contact(contact));}

  static async CreateInitialAccountForNewUser<newPropType extends AccountProps, userProps extends UserProps>(props:newPropType,newUser:User<userProps>): Promise<Account<newPropType>> {
    props.name = newUser.id;
    var account = new Account(props);

    account.addDefaultRoles();
    account.addContact(newUser);
    console.log('after-adding-contact', JSON.stringify(account));
    await account.assignRoleToContact(account.props.roles.find(x => x.roleName === adminRoleName), (await account.props.contacts())[0]);
    console.log('after-assigning-role', JSON.stringify(account));
    account.markAsNew();
    return account;
  }

  private async addContact<userProps extends UserProps>(newUser:User<userProps>): Promise<void> {
    this.props.addContact(new Contact(this.props.getNewContact()));
    var contactProps = (await this.props.contacts())[0];
    contactProps.firstName = newUser.firstName;
    contactProps.lastName = newUser.lastName;
    contactProps.addUser(newUser);
    console.log('add-contact', contactProps);
  }

  private async assignRoleToContact(role: RoleProps, contact: ContactProps): Promise<void> {
    var verifiedRole = this.props.roles.find(x => x.id === role.id);
    if(!verifiedRole) {
      console.log('role-not-found', this.props.roles, role);
      throw new Error('Role does not exist');
    }
    var verifiedAccountContact = (await this.props.contacts()).find(x => x.id === contact.id);
    if(!verifiedAccountContact) {
      console.log('contact-not-found', this.props.contacts, contact);
      throw new Error('Contact does not exist');
    }
    if(verifiedAccountContact.role && verifiedAccountContact.role.id === role.id) {
      throw new Error('Contact already has role');
    }
    verifiedAccountContact.addRole(new Role(verifiedRole));
  }

  private addDefaultRoles(): void {
    var roleProps =this.props.getNewRole();
    console.log('add-default-roles');
    var newRoleProps ={
      roleName: adminRoleName,
      isDefault: true,
      permissions: {
        accountPermissions: {
          canManageRolesAndPermissions:true
        } ,
        listingPermissions: {
          canManageListings: true
        } 
      }
    } as Partial<RoleProps>;
    var meredProps = {...roleProps, ...newRoleProps};
    var role = new Role(meredProps);
    this.props.addRole(role);
    console.log('add-default-roles-done', this.props.roles);
  }

  private markAsNew(): void {
    //create integraiton event 
  }

  async deleteRoleAndReassignTo(roleToDelete: RoleEntityReference, roleToAssignTo: RoleEntityReference, passport:Passport): Promise<void> {
    if(!passport.forAcccount(this).determineIf((permissions) => permissions.canManageRolesAndPermissions)) {
      throw new Error('Cannot delete role');
    }
    if(!this.props.roles.includes(roleToDelete)) {
      throw new Error('Role to delete does not exist');
    }
    if(!this.props.roles.includes(roleToAssignTo)) {
      throw new Error('Role to assign to does not exist');
    }
    if(roleToDelete.isDefault) {
      throw new Error('Cannot delete default role');
    }
    (await this.props.contacts()).forEach(contact => {
      if(contact.role.id === roleToDelete.id) {
        contact.role = roleToAssignTo;
      }
    });
    this.props.roles.splice(this.props.roles.indexOf(roleToDelete), 1);
  }
  
}

export interface AccountEntityReference extends Readonly<EntityProps> {
  readonly name: string;
  readonly updatedAt: Date;
  readonly createdAt: Date;
  readonly schemaVersion: string;
  readonly contacts: () => Promise<ContactEntityReference[]>;
}

export interface AccountPermissions {
  canManageRolesAndPermissions: boolean;
} 