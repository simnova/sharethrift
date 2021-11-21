export interface TypeConverter<MongoType, DomainType, DomainPropType> {
  toDomain(mongoType: MongoType): DomainType;
  toMongo(domainType: DomainType): MongoType; //TODO - change to PersistanceType
  toAdapter(mongoType: MongoType | DomainType): DomainPropType;
}