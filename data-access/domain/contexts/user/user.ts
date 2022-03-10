import { UserCreatedEvent } from '../../events/user-created';
import { AggregateRoot } from '../../shared/aggregate-root';
import { EntityProps } from '../../shared/entity';
import { DomainExecutionContext } from '../context';
import { PassportImpl } from '../iam/passport';
import * as ValueObjects from './user-value-objects';

export interface UserProps extends EntityProps {
  externalId:string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  schemaVersion: string;
}

export interface UserEntityReference extends Readonly<UserProps> {}

export class User<props extends UserProps> extends AggregateRoot<props> implements UserEntityReference  {
  private isNew:boolean = false;
  constructor(props: props,private context?:DomainExecutionContext) { super(props); }
 
  get id(): string {return this.props.id;}
  get externalId(): string {return this.props.externalId;}
  get firstName(): string {return this.props.firstName;}
  get lastName(): string {return this.props.lastName;}
  get email(): string {return this.props.email;}
  get updatedAt(): Date {return this.props.updatedAt;}
  get createdAt(): Date {return this.props.createdAt;}
  get schemaVersion(): string {return this.props.schemaVersion;}

  public static async getNewUser<props extends UserProps> (newprops:props,externalId:string,firstName:string,lastName:string): Promise<User<props>> {
    newprops.externalId = externalId;
    let user = new User(newprops);
    user.MarkAsNew();
    await user.setExternalId(externalId);
    await user.setFirstName(firstName);
    await user.setLastName(lastName);
    user.context = {passport: new PassportImpl(user)};
    return user;
  }

  private MarkAsNew(): void {
    this.isNew = true;
    this.addIntegrationEvent(UserCreatedEvent,{userId: this.props.id,context:this.context});
  }

  private async ensureThat(func:((permissions:UserPermissions) => boolean)) :  Promise<void> {
    if(this.isNew) return; // no need to check permissions on new user
    if(!this.context || !await(this.context.passport.forUser(this).determineIf(func))) { throw new Error('User is not authorized'); }
  }

  public async setFirstName(firstName:ValueObjects.FirstName): Promise<void> {
    await this.ensureThat(permissions => permissions.canManageUser);
    this.props.firstName = firstName.valueOf();
  }

  public async setLastName(lastName:ValueObjects.LastName): Promise<void> {
    await this.ensureThat(permissions => permissions.canManageUser);
    this.props.lastName = lastName.valueOf();
  }

  public async setEmail(email:ValueObjects.Email): Promise<void> {
    await this.ensureThat(permissions => permissions.canManageUser);
    this.props.email = email.valueOf();
  }

  public async setExternalId(externalId:ValueObjects.ExternalId): Promise<void> {
    await this.ensureThat(permissions => permissions.canManageUser);
    this.props.externalId = externalId.valueOf();
  }

}

export interface UserPermissions {
  canManageUser: boolean;
} 