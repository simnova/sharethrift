import { Base } from "../../../infrastructure/data-sources/cosmos-db/models/interfaces/base";

export abstract class MongooseDomainAdapater<T extends Base> {
  constructor(public readonly props: T) { }
  get id() {return this.props.id;}
  get createdAt() {return this.props.createdAt;}
  get updatedAt() {return this.props.updatedAt;}
  get schemaVersion() {return this.props.schemaVersion;}
}