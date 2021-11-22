import { Base } from '../../../infrastructure/data-sources/cosmos-db/models/interfaces/base';
import { AggregateRoot } from '../../shared/aggregate-root';
import { TypeConverter } from '../../shared/type-converter';
import { MongooseDomainAdapaterType } from './mongo-domain-adapter';

export abstract class MongoTypeConverter<MongooseModelType extends Base,DomainPropInterface extends MongooseDomainAdapaterType<MongooseModelType>, DomainType extends AggregateRoot<DomainPropInterface>> implements TypeConverter<MongooseModelType, DomainType,DomainPropInterface> {
  constructor(
    private adapter: new(args:MongooseModelType) => DomainPropInterface,
    private domainObject: new(args:DomainPropInterface) => DomainType
  ) {}
  toMongo(domainType: DomainType): MongooseModelType {
    return domainType.props.props;
  }
  toDomain(mongoType: MongooseModelType): DomainType {
    if(!mongoType) { return null;}
    return new this.domainObject(this.toAdapter(mongoType));
  }
  toAdapter(mongoType: MongooseModelType | DomainType): DomainPropInterface {
    if(mongoType instanceof this.domainObject) {
      return mongoType.props;
    }
    return new this.adapter(mongoType as MongooseModelType);
  }

}