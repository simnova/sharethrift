import { UserCreatedEvent } from '../../events/user-created';
import { AggregateRoot } from '../../shared/aggregate-root';
import { EntityProps } from '../../shared/entity';
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
  constructor(props: props) { super(props); }

  get id(): string {return this.props.id;}
  get externalId(): string {return this.props.externalId;}
  get firstName(): string {return this.props.firstName;}
  get lastName(): string {return this.props.lastName;}
  get email(): string {return this.props.email;}
  get updatedAt(): Date {return this.props.updatedAt;}
  get createdAt(): Date {return this.props.createdAt;}
  get schemaVersion(): string {return this.props.schemaVersion;}

  public static getNewUser<props extends UserProps> (newprops:props,externalId:string,firstName:string,lastName:string): User<props> {
    newprops.externalId = externalId;
    let user = new User(newprops);
    user.setExternalId(externalId);
    user.setFirstName(firstName);
    user.setLastName(lastName);
    user.MarkAsNew();
    return user;
  }

  private MarkAsNew(): void {
    this.addIntegrationEvent(UserCreatedEvent,{userId: this.props.id});
  }

  public setFirstName(firstName:ValueObjects.FirstName): void {
    this.props.firstName = firstName.valueOf();
  }

  public setLastName(lastName:ValueObjects.LastName): void {
    this.props.lastName = lastName.valueOf();
  }

  public setEmail(email:ValueObjects.Email): void {
    this.props.email = email.valueOf();
  }

  public setExternalId(externalId:ValueObjects.ExternalId): void {
    this.props.externalId = externalId.valueOf();
  }

}