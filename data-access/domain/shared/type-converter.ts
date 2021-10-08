export interface TypeConverter<MongoType, DomainType> {
  toDomain(mongoType: MongoType): DomainType;
  toMongo(domainType: DomainType): MongoType;
}
