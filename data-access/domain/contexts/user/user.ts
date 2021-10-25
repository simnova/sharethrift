import { UserCreatedEvent } from '../../events/user-created';
import { AggregateRoot } from '../../shared/aggregate-root';

export interface UserProps {
  id:string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  schemaVersion: string;
}
export class User<props extends UserProps> extends AggregateRoot<props> implements UserEntityReference  {
  constructor(props: props) { super(props); }

  get id(): string {return this.props.id;}
  get firstName(): string {return this.props.firstName;}
  get lastName(): string {return this.props.lastName;}
  get email(): string {return this.props.email;}
  get updatedAt(): Date {return this.props.updatedAt;}
  get createdAt(): Date {return this.props.createdAt;}
  get schemaVersion(): string {return this.props.schemaVersion;}
  public MarkAsNew(): void {
    this.addIntegrationEvent(UserCreatedEvent,{userId: this.props.id});
  }
}

export interface UserEntityReference {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly schemaVersion?: string;
}