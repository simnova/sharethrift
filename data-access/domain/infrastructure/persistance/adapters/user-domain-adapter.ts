import { User } from '../../../../infrastructure/data-sources/cosmos-db/models/user';
import { User as UserDO, UserProps } from '../../../contexts/user/user';
import { MongooseDomainAdapater } from '../mongo-domain-adapter';
import { MongoTypeConverter } from '../mongo-type-converter';

export class UserConverter extends MongoTypeConverter<User,UserDomainAdapter,UserDO<UserDomainAdapter>> {
  constructor() {
    super(UserDomainAdapter, UserDO);
  }
}
export class UserDomainAdapter extends MongooseDomainAdapater<User> implements UserProps {
  constructor(props: User) { super(props); }

  get externalId() {return this.props.externalId;}
  set externalId(externalId: string) {this.props.externalId = externalId;}

  get firstName() {return this.props.firstName;}
  set firstName(firstName: string) {this.props.firstName = firstName;}

  get lastName() {return this.props.lastName;}
  set lastName(lastName: string) {this.props.lastName = lastName;}

  get email() {return this.props.email;}
  set email(email: string) {this.props.email = email;}
}