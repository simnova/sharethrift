import { ExecutionContext } from "./execution-context";

export interface TypeConverter<MongoType, DomainType, DomainPropType, ContextType extends ExecutionContext> {
  toDomain(mongoType: MongoType, context:ContextType): DomainType;
  toMongo(domainType: DomainType): MongoType; //TODO - change to PersistanceType
  toAdapter(mongoType: MongoType | DomainType): DomainPropType;
}