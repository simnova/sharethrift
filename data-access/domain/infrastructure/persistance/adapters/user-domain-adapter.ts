import { User } from "../../../../infrastructure/data-sources/cosmos-db/models/user";
import { UserProps } from "../../../contexts/user/user";
import { MongooseDomainAdapater } from "../mongo-domain-adapter";

export class UserDomainAdapter extends MongooseDomainAdapater<User> implements UserProps {
  constructor( props: User) { super(props); }

  get firstName() {return this.props.firstName;}
  set firstName(firstName: string) {this.props.firstName = firstName;}

  get lastName() {return this.props.lastName;}
  set lastName(lastName: string) {this.props.lastName = lastName;}

  get email() {return this.props.email;}
  set email(email: string) {this.props.email = email;}
}