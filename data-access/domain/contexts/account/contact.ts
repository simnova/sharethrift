import { Entity, EntityProps } from '../../shared/entity';
import { User, UserEntityReference, UserProps } from '../user/user';
import { Role, RoleEntityReference, RoleProps} from './role';

export interface ContactProps extends EntityProps {
  firstName: string;
  lastName: string;
  roleId: string;
  addRole(props: RoleEntityReference): void;
  readonly user: UserEntityReference;
  addUser<props extends UserProps>(user: User<props>):void
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactEntityReference extends Readonly<Omit<ContactProps, 'addRole' | 'addUser'>> {
}

export class Contact<props extends ContactProps> extends Entity<ContactProps> implements ContactEntityReference {
  constructor(props: props) {
    super(props);
  }
  get id(): string { return this.props.id; }
  get firstName(): string { return this.props.firstName; }
  get lastName(): string { return this.props.lastName; }
  get roleId(): string { return this.props.roleId; }
  get user(): UserEntityReference { return this.props.user; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }
}