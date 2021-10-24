import { AggregateRoot } from '../../shared/aggregate-root';
import { EntityProps } from '../../shared/entity';
import { Passport } from '../iam/passport';
import { Contact, ContactEntityReference, ContactProps } from './contact';
import { RoleProps, RoleEntityReference } from './role';

export interface AccountProps extends EntityProps {
  name: string;
  contacts: ContactProps[];
  roles: RoleProps[];
  createdAt: Date;
  updatedAt: Date;
  schemaVersion: string;
}

export class Account<props extends AccountProps> extends AggregateRoot<props> implements AccountEntityReference  {
  constructor(props: props) { super(props); }

  get name(): string {return this.props.name;}
  get updatedAt(): Date {return this.props.updatedAt;}
  get createdAt(): Date {return this.props.createdAt;}
  get schemaVersion(): string {return this.props.schemaVersion;}
  get contacts(): ContactEntityReference[] {return this.props.contacts.map(contact => new Contact(contact));}

  deleteRoleAndReassignTo(roleToDelete: RoleEntityReference, roleToAssignTo: RoleEntityReference, passport:Passport): void {
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
    this.props.contacts.forEach(contact => {
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
  readonly contacts: ContactEntityReference[];
}

export interface AccountPermissions {
  canManageRolesAndPermissions: boolean;
} 